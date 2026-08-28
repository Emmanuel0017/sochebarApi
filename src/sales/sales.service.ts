import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CashService } from '../cash/cash.service';
import { CustomersService } from '../customers/customers.service';
import { AuditService } from '../audit/audit.service';
import { localEndOfDay, localStartOfDay } from '../common/date-range.util';
import { CreateSaleDto, VoidSaleDto } from './dto/sale.dto';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
    private cashService: CashService,
    private customersService: CustomersService,
    private auditService: AuditService,
  ) {}

  findAll(params: { status?: string; userId?: string; from?: string; to?: string }) {
    return this.prisma.sale.findMany({
      where: {
        status: params.status as any,
        userId: params.userId,
        saleDate:
          params.from || params.to
            ? {
                gte: params.from ? localStartOfDay(params.from) : undefined,
                lte: params.to ? localEndOfDay(params.to) : undefined,
              }
            : undefined,
      },
      include: {
        items: { include: { product: true } },
        payments: true,
        customer: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, unit: true } },
        payments: true,
        customer: true,
        user: { select: { id: true, name: true } },
      },
    });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  private async generateInvoiceNumber(tx: any): Promise<string> {
    const count = await tx.sale.count();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `INV-${datePart}-${String(count + 1).padStart(5, '0')}`;
  }

  /**
   * A sale is one atomic transaction (design doc section 27):
   *   Create sale -> create items -> validate stock -> decrease inventory ->
   *   create payment records -> update cash/mobile/bank/credit -> audit log.
   * Stock can never go negative; if any item is short, the whole sale rolls back.
   */
  async create(dto: CreateSaleDto, actorId: string, actorRole: string) {
    return this.prisma.$transaction(async (tx) => {
      const items = dto.items ?? [];
      const hasItems = items.length > 0;

      if (!hasItems && !dto.manualTotal) {
        throw new BadRequestException(
          'Provide either item lines or a manualTotal - a sale/bill needs one or the other',
        );
      }

      const subtotal = hasItems
        ? items.reduce((sum, i) => sum + i.quantity * i.unitPrice - (i.discount ?? 0), 0)
        : dto.manualTotal!;
      const discount = dto.discount ?? 0;
      const tax = dto.tax ?? 0;
      const total = subtotal - discount + tax;

      const paidTotal = dto.payments.reduce((sum, p) => sum + p.amount, 0);
      const creditPortion = dto.payments.find((p) => p.paymentMethod === 'CREDIT')?.amount ?? 0;
      const nonCreditPaid = paidTotal - creditPortion;

      if (creditPortion > 0 && !dto.customerId) {
        throw new BadRequestException('Credit sales require a customer');
      }
      if (paidTotal < total - 0.01) {
        throw new BadRequestException(`Payments (${paidTotal}) do not cover the sale total (${total})`);
      }

      if (creditPortion > 0 && dto.customerId) {
        await this.customersService.assertWithinCreditLimit(dto.customerId, creditPortion);
      }

      // Validate stock for every line BEFORE decreasing anything, so a
      // shortage on item 3 doesn't leave items 1-2 already decremented.
      // Skipped entirely for item-less (manualTotal) bills - there's no
      // stock effect to validate.
      // NOTE for backdated sales: this checks CURRENT total stock, not stock
      // as it stood on the backdated date. Entering a past sale still keeps
      // today's running total correct (it posts a real ledger entry), but if
      // stock has since been sold below what was available on that past day,
      // this can't detect that - there's no point-in-time stock check here.
      for (const item of items) {
        const unit = await tx.productUnit.findUniqueOrThrow({ where: { id: item.unitId } });
        const requiredBase = item.quantity * Number(unit.quantityInBaseUnit);
        await this.inventoryService.assertSufficientStock(item.productId, requiredBase, tx as any);
      }

      const invoiceNumber = await this.generateInvoiceNumber(tx);

      // A sale is "backdated" when a past saleDate was explicitly given.
      // Backdated sales don't attach to today's open cash session - that
      // cash wasn't actually counted in today's till, so pulling it in
      // would corrupt today's reconciliation. They also post their
      // inventory ledger entries as of that past date, not "now", so
      // day-scoped reports (Sales list, Product sales, the daily sheet)
      // show them on the day they belong to.
      // "Today" in the business's local timezone (not the server's), so a
      // sale entered as today's date is never mistakenly treated as
      // backdated just because the server clock disagrees.
      const todayLocalStr = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const resolvedSaleDate = dto.saleDate ? localStartOfDay(dto.saleDate) : new Date();
      const isBackdated = !!dto.saleDate && dto.saleDate !== todayLocalStr;

      const cashSession = isBackdated
        ? null
        : await tx.cashSession.findFirst({ where: { userId: actorId, status: 'OPEN' } });

      const sale = await tx.sale.create({
        data: {
          invoiceNumber,
          userId: actorId,
          customerId: dto.customerId,
          cashSessionId: cashSession?.id,
          saleDate: resolvedSaleDate,
          subtotal,
          discount,
          tax,
          total,
          status: 'COMPLETED',
          items: hasItems
            ? {
                create: items.map((i) => ({
                  productId: i.productId,
                  unitId: i.unitId,
                  quantity: i.quantity,
                  unitPrice: i.unitPrice,
                  discount: i.discount ?? 0,
                  total: i.quantity * i.unitPrice - (i.discount ?? 0),
                })),
              }
            : undefined,
          payments: {
            create: dto.payments.map((p) => ({
              paymentMethod: p.paymentMethod,
              amount: p.amount,
              reference: p.reference,
              paidAt: resolvedSaleDate,
              createdById: actorId,
            })),
          },
        },
        include: { items: true, payments: true },
      });

      // Decrease inventory for every line item (no-op for item-less bills).
      for (const item of items) {
        await this.inventoryService.recordMovement(
          {
            productId: item.productId,
            unitId: item.unitId,
            transactionType: 'SALE',
            quantityInUnit: item.quantity,
            referenceType: 'SALE',
            referenceId: sale.id,
            saleId: sale.id,
            createdById: actorId,
            occurredAt: isBackdated ? resolvedSaleDate : undefined,
          },
          tx as any,
        );
      }

      // Cash session ledger entry for the cash-equivalent portion actually
      // received into the till/mobile-money/bank right now.
      if (cashSession && nonCreditPaid > 0) {
        const cashPortion = dto.payments
          .filter((p) => p.paymentMethod === 'CASH')
          .reduce((sum, p) => sum + p.amount, 0);
        if (cashPortion > 0) {
          await tx.cashTransaction.create({
            data: {
              cashSessionId: cashSession.id,
              transactionType: 'SALE',
              amount: cashPortion,
              referenceType: 'SALE',
              referenceId: sale.id,
              saleId: sale.id,
              description: `Sale ${invoiceNumber}`,
              createdById: actorId,
            },
          });
        }
      }

      // Customer credit ledger for the credit portion.
      if (creditPortion > 0 && dto.customerId) {
        await tx.customerTransaction.create({
          data: {
            customerId: dto.customerId,
            transactionType: 'CREDIT_SALE',
            amount: creditPortion,
            referenceType: 'SALE',
            referenceId: sale.id,
            saleId: sale.id,
            description: `Credit sale ${invoiceNumber}`,
          },
        });
      }

      await this.auditService.log({
        userId: actorId,
        action: 'CREATE_SALE',
        entityType: 'Sale',
        entityId: sale.id,
        newValues: { total, invoiceNumber, itemCount: items.length, isFreeformBill: !hasItems },
      });

      return sale;
    });
  }

  /**
   * Voiding never deletes the sale - it reverses inventory and reopens the
   * financial trail via new (reversing) ledger entries, and the sale row is
   * kept with status=VOIDED for a full audit trail (design doc section 17/26).
   */
  async void(id: string, dto: VoidSaleDto, actorId: string, actorRole: string) {
    if (actorRole === 'CASHIER' || actorRole === 'BARTENDER') {
      throw new BadRequestException('Cashiers/bartenders cannot void sales - manager approval required');
    }

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({ where: { id }, include: { items: true, payments: true } });
      if (!sale) throw new NotFoundException('Sale not found');
      if (sale.status !== 'COMPLETED') throw new BadRequestException('Only completed sales can be voided');

      await tx.sale.update({ where: { id }, data: { status: 'VOIDED', voidReason: dto.reason } });

      // Reverse inventory: put stock back (RETURN-style ADJUSTMENT movement).
      for (const item of sale.items) {
        await this.inventoryService.recordMovement(
          {
            productId: item.productId,
            unitId: item.unitId,
            transactionType: 'RETURN',
            quantityInUnit: Number(item.quantity),
            referenceType: 'SALE',
            referenceId: sale.id,
            saleId: sale.id,
            createdById: actorId,
          },
          tx as any,
        );
      }

      if (sale.cashSessionId) {
        const cashPaid = sale.payments.filter((p) => p.paymentMethod === 'CASH').reduce((s, p) => s + Number(p.amount), 0);
        if (cashPaid > 0) {
          await tx.cashTransaction.create({
            data: {
              cashSessionId: sale.cashSessionId,
              transactionType: 'REFUND',
              amount: cashPaid,
              referenceType: 'SALE',
              referenceId: sale.id,
              saleId: sale.id,
              description: `Void reversal: ${dto.reason}`,
              createdById: actorId,
            },
          });
        }
      }

      if (sale.customerId) {
        const creditPaid = sale.payments
          .filter((p) => p.paymentMethod === 'CREDIT')
          .reduce((s, p) => s + Number(p.amount), 0);
        if (creditPaid > 0) {
          await tx.customerTransaction.create({
            data: {
              customerId: sale.customerId,
              transactionType: 'ADJUSTMENT',
              amount: -creditPaid,
              referenceType: 'SALE',
              referenceId: sale.id,
              saleId: sale.id,
              description: `Void reversal: ${dto.reason}`,
            },
          });
        }
      }

      await this.auditService.log({
        userId: actorId,
        action: 'VOID_SALE',
        entityType: 'Sale',
        entityId: id,
        newValues: { reason: dto.reason },
      });

      return tx.sale.findUnique({ where: { id }, include: { items: true, payments: true } });
    });
  }
}
