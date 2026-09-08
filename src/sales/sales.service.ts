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
        payments: { include: { customer: true } },
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
        payments: { include: { customer: true } },
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
      const creditPayments = dto.payments.filter((p) => p.paymentMethod === 'CREDIT');
      const creditPortion = creditPayments.reduce((sum, p) => sum + p.amount, 0);
      const nonCreditPaid = paidTotal - creditPortion;

      // Every CREDIT payment line needs a customer - either its own
      // customerId, or (for backward compatibility with older clients that
      // only ever sent one) the sale-level customerId. This is what allows
      // several CREDIT lines on one sale to be billed to different people.
      const resolvedCreditPayments = creditPayments.map((p) => ({
        ...p,
        customerId: p.customerId ?? dto.customerId,
      }));
      if (resolvedCreditPayments.some((p) => !p.customerId)) {
        throw new BadRequestException('Every credit payment line requires a customer');
      }

      if (paidTotal < total - 0.01) {
        throw new BadRequestException(`Payments (${paidTotal}) do not cover the sale total (${total})`);
      }

      // Credit limits are per customer, so if two lines happen to credit the
      // same customer, check the combined amount against their limit once.
      const creditByCustomer = new Map<string, number>();
      for (const p of resolvedCreditPayments) {
        creditByCustomer.set(p.customerId!, (creditByCustomer.get(p.customerId!) ?? 0) + p.amount);
      }
      for (const [custId, amount] of creditByCustomer) {
        await this.customersService.assertWithinCreditLimit(custId, amount);
      }

      // --- IMPROVED STOCK VALIDATION ---
      // Evaluate ALL items before failing. Collect all shortages into an array
      // so the cashier can see everything they need to fix at once.
      const missingStockItems: string[] = [];

      for (const item of items) {
        const unit = await tx.productUnit.findUniqueOrThrow({ where: { id: item.unitId } });
        const product = await tx.product.findUniqueOrThrow({ where: { id: item.productId } });
        const requiredBase = item.quantity * Number(unit.quantityInBaseUnit);
        const current = await this.inventoryService.getCurrentStock(item.productId, tx as any);

        if (current < requiredBase) {
          missingStockItems.push(`"${product.name}" (have ${current}, need ${requiredBase})`);
        }
      }

      if (missingStockItems.length > 0) {
        throw new BadRequestException(
          `Insufficient stock for: ${missingStockItems.join(', ')}`,
        );
      }
      // ---------------------------------

      const invoiceNumber = await this.generateInvoiceNumber(tx);

      const todayLocalStr = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const resolvedSaleDate = dto.saleDate ? localStartOfDay(dto.saleDate) : new Date();
      const isBackdated = !!dto.saleDate && dto.saleDate !== todayLocalStr;

      const cashSession = isBackdated
        ? null
        : await tx.cashSession.findFirst({ where: { userId: actorId, status: 'OPEN' } });

      // "Primary" customer on the Sale record itself - kept for backward
      // compatibility (filtering sales by customer, the Sale.customer
      // relation shown in sale lists) - resolved from dto.customerId, or
      // else the first credited customer if this is a multi-customer sale.
      const primaryCustomerId = dto.customerId ?? resolvedCreditPayments[0]?.customerId;

      const sale = await tx.sale.create({
        data: {
          invoiceNumber,
          userId: actorId,
          customerId: primaryCustomerId,
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
              customerId: p.paymentMethod === 'CREDIT' ? p.customerId ?? dto.customerId : undefined,
              comment: p.comment,
              paidAt: resolvedSaleDate,
              createdById: actorId,
            })),
          },
        },
        include: { items: true, payments: true },
      });

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

      // One CustomerTransaction per credited customer - this is what makes
      // one sale billable to several tabs at once instead of just one.
      let creditedCustomers: { id: string; name: string; amount: number }[] = [];
      if (creditByCustomer.size > 0) {
        const custRecords = await tx.customer.findMany({
          where: { id: { in: [...creditByCustomer.keys()] } },
          select: { id: true, name: true },
        });
        const nameById = new Map(custRecords.map((c) => [c.id, c.name]));
        creditedCustomers = [...creditByCustomer.entries()].map(([id, amount]) => ({
          id,
          name: nameById.get(id) ?? 'Unknown customer',
          amount,
        }));

        for (const p of resolvedCreditPayments) {
          const comment = p.comment ? ` — ${p.comment}` : '';
          await tx.customerTransaction.create({
            data: {
              customerId: p.customerId!,
              transactionType: 'CREDIT_SALE',
              amount: p.amount,
              referenceType: 'SALE',
              referenceId: sale.id,
              saleId: sale.id,
              description: `Credit sale ${invoiceNumber}${comment}`,
              // Bill date follows the sale's own date (which may be
              // backdated via dto.saleDate) rather than the moment this
              // record happens to be inserted, so a bill entered late for
              // an earlier day still shows and filters under that day.
              createdAt: resolvedSaleDate,
            },
          });
        }
      }

      // Rich snapshot for the Activity log: exact products sold, exact
      // customer(s) credited and for how much, and the full payment
      // breakdown - so a manager can see what happened without having to
      // dig into the live Sale record.
      const productNames = items.length
        ? new Map(
            (
              await tx.product.findMany({ where: { id: { in: items.map((i) => i.productId) } }, select: { id: true, name: true } })
            ).map((p) => [p.id, p.name]),
          )
        : new Map<string, string>();
      const unitNames = items.length
        ? new Map(
            (
              await tx.productUnit.findMany({ where: { id: { in: items.map((i) => i.unitId) } }, select: { id: true, name: true } })
            ).map((u) => [u.id, u.name]),
          )
        : new Map<string, string>();

      await this.auditService.log({
        userId: actorId,
        action: 'CREATE_SALE',
        entityType: 'Sale',
        entityId: sale.id,
        newValues: {
          total,
          invoiceNumber,
          itemCount: items.length,
          isFreeformBill: !hasItems,
          items: items.map((i) => ({
            product: productNames.get(i.productId) ?? 'Unknown product',
            unit: unitNames.get(i.unitId),
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.quantity * i.unitPrice - (i.discount ?? 0),
          })),
          customerName: creditedCustomers[0]?.name,
          customers: creditedCustomers,
          payments: dto.payments.map((p) => ({
            paymentMethod: p.paymentMethod,
            amount: p.amount,
            customerName: p.paymentMethod === 'CREDIT' ? creditedCustomers.find((c) => c.id === (p.customerId ?? dto.customerId))?.name : undefined,
            comment: p.comment,
          })),
        },
      });

      return sale;
    });
  }

  async void(id: string, dto: VoidSaleDto, actorId: string, actorRole: string) {
    if (actorRole === 'CASHIER' || actorRole === 'BARTENDER') {
      throw new BadRequestException('Cashiers/bartenders cannot void sales - manager approval required');
    }

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({ where: { id }, include: { items: true, payments: true } });
      if (!sale) throw new NotFoundException('Sale not found');
      if (sale.status !== 'COMPLETED') throw new BadRequestException('Only completed sales can be voided');

      await tx.sale.update({ where: { id }, data: { status: 'VOIDED', voidReason: dto.reason } });

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

      // Reverse CREDIT per payment line's own customer - a voided sale that
      // had several customers credited needs each of their tabs adjusted
      // back individually, not just the sale's single "primary" customer.
      const creditByCustomer = new Map<string, number>();
      for (const p of sale.payments) {
        if (p.paymentMethod !== 'CREDIT') continue;
        const custId = p.customerId ?? sale.customerId;
        if (!custId) continue;
        creditByCustomer.set(custId, (creditByCustomer.get(custId) ?? 0) + Number(p.amount));
      }

      let reversedCustomers: { id: string; name: string; amount: number }[] = [];
      if (creditByCustomer.size > 0) {
        const custRecords = await tx.customer.findMany({
          where: { id: { in: [...creditByCustomer.keys()] } },
          select: { id: true, name: true },
        });
        const nameById = new Map(custRecords.map((c) => [c.id, c.name]));
        reversedCustomers = [...creditByCustomer.entries()].map(([custId, amount]) => ({
          id: custId,
          name: nameById.get(custId) ?? 'Unknown customer',
          amount,
        }));

        for (const [custId, amount] of creditByCustomer) {
          await tx.customerTransaction.create({
            data: {
              customerId: custId,
              transactionType: 'ADJUSTMENT',
              amount: -amount,
              referenceType: 'SALE',
              referenceId: sale.id,
              saleId: sale.id,
              description: `Void reversal: ${dto.reason}`,
            },
          });
        }
      }

      const productNames = sale.items.length
        ? new Map(
            (
              await tx.product.findMany({ where: { id: { in: sale.items.map((i) => i.productId) } }, select: { id: true, name: true } })
            ).map((p) => [p.id, p.name]),
          )
        : new Map<string, string>();

      await this.auditService.log({
        userId: actorId,
        action: 'VOID_SALE',
        entityType: 'Sale',
        entityId: id,
        newValues: {
          reason: dto.reason,
          total: Number(sale.total),
          invoiceNumber: sale.invoiceNumber,
          items: sale.items.map((i) => ({
            product: productNames.get(i.productId) ?? 'Unknown product',
            quantity: Number(i.quantity),
            total: Number(i.total),
          })),
          customerName: reversedCustomers[0]?.name,
          customers: reversedCustomers,
        },
      });

      return tx.sale.findUnique({ where: { id }, include: { items: true, payments: true } });
    });
  }
}