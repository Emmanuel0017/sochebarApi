import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { AuditService } from '../audit/audit.service';
import { CreatePurchaseDto } from './dto/purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
    private auditService: AuditService,
  ) {}

  findAll(params: { supplierId?: string }) {
    return this.prisma.purchase.findMany({
      where: { supplierId: params.supplierId },
      include: { supplier: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { product: true, unit: true } } },
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }

  /**
   * A purchase is one atomic transaction:
   *   Create purchase -> create items -> increase inventory ->
   *   update supplier account -> record payment/cash movement if paid -> audit log.
   * All of this happens inside a single DB transaction (see design doc section 27).
   */
  async create(dto: CreatePurchaseDto, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      const subtotal = dto.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
      const discount = dto.discount ?? 0;
      const tax = dto.tax ?? 0;
      const total = subtotal - discount + tax;

      // A purchase with no supplier has no counterparty to owe, so it can't
      // be tracked as CREDIT/PARTIAL - treat it as paid in full at receipt.
      const amountPaid = dto.supplierId ? Math.min(dto.amountPaidNow ?? 0, total) : total;
      const paymentStatus = !dto.supplierId
        ? 'PAID'
        : amountPaid <= 0
          ? 'CREDIT'
          : amountPaid < total
            ? 'PARTIAL'
            : 'PAID';

      const purchase = await tx.purchase.create({
        data: {
          supplierId: dto.supplierId,
          invoiceNumber: dto.invoiceNumber,
          subtotal,
          discount,
          tax,
          total,
          amountPaid,
          paymentStatus,
          notes: dto.notes,
          createdById: actorId,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              unitId: item.unitId,
              quantity: item.quantity,
              unitCost: item.unitCost,
              totalCost: item.quantity * item.unitCost,
            })),
          },
        },
        include: { items: true },
      });

      // Inventory increases for every line item.
      for (const item of dto.items) {
        await this.inventoryService.recordMovement(
          {
            productId: item.productId,
            unitId: item.unitId,
            transactionType: 'PURCHASE',
            quantityInUnit: item.quantity,
            unitCost: item.unitCost,
            referenceType: 'PURCHASE',
            referenceId: purchase.id,
            purchaseId: purchase.id,
            createdById: actorId,
          },
          tx as any,
        );
      }

      // Supplier ledger entries only make sense when there's a supplier.
      if (dto.supplierId) {
        // Supplier owes the full purchase total the moment stock is received,
        // regardless of how much (if anything) was paid immediately.
        await tx.supplierTransaction.create({
          data: {
            supplierId: dto.supplierId,
            transactionType: 'PURCHASE',
            amount: total,
            referenceType: 'PURCHASE',
            referenceId: purchase.id,
            purchaseId: purchase.id,
            description: `Purchase ${purchase.invoiceNumber ?? purchase.id}`,
          },
        });

        if (amountPaid > 0) {
          await tx.supplierTransaction.create({
            data: {
              supplierId: dto.supplierId,
              transactionType: 'PAYMENT',
              amount: amountPaid,
              referenceType: 'PURCHASE',
              referenceId: purchase.id,
              purchaseId: purchase.id,
              description: `Payment on receipt for ${purchase.invoiceNumber ?? purchase.id}`,
            },
          });

          // If paid in cash, this should also hit the active cash session -
          // left as a hook: pass a cashSessionId via a dedicated endpoint if
          // the payment came out of the till. Bank/mobile-money payments don't
          // touch the cash session ledger.
        }
      }

      await this.auditService.log({
        userId: actorId,
        action: 'CREATE_PURCHASE',
        entityType: 'Purchase',
        entityId: purchase.id,
        newValues: { total, paymentStatus, itemCount: dto.items.length, supplierId: dto.supplierId ?? null },
      });

      return purchase;
    });
  }

  async pay(id: string, amount: number, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findUniqueOrThrow({ where: { id } });
      if (!purchase.supplierId) {
        throw new Error('This purchase has no supplier attached, so there is nothing to pay off');
      }
      const newAmountPaid = Number(purchase.amountPaid) + amount;
      const paymentStatus = newAmountPaid >= Number(purchase.total) ? 'PAID' : 'PARTIAL';

      const updated = await tx.purchase.update({
        where: { id },
        data: { amountPaid: newAmountPaid, paymentStatus },
      });

      await tx.supplierTransaction.create({
        data: {
          supplierId: purchase.supplierId,
          transactionType: 'PAYMENT',
          amount,
          referenceType: 'PURCHASE',
          referenceId: id,
          purchaseId: id,
          description: `Payment for ${purchase.invoiceNumber ?? id}`,
        },
      });

      await this.auditService.log({
        userId: actorId,
        action: 'PAY_PURCHASE',
        entityType: 'Purchase',
        entityId: id,
        newValues: { amount, newAmountPaid },
      });

      return updated;
    });
  }
}
