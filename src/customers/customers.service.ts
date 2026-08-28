import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(dto: CreateCustomerDto, actorId: string) {
    const customer = await this.prisma.customer.create({ data: dto });
    await this.auditService.log({
      userId: actorId,
      action: 'CREATE_CUSTOMER',
      entityType: 'Customer',
      entityId: customer.id,
      newValues: dto,
    });
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto, actorId: string) {
    const before = await this.findOne(id);
    const customer = await this.prisma.customer.update({ where: { id }, data: dto });
    await this.auditService.log({
      userId: actorId,
      action: 'UPDATE_CUSTOMER',
      entityType: 'Customer',
      entityId: id,
      oldValues: before,
      newValues: dto,
    });
    return customer;
  }

  // Every bill/payment on this customer's account, newest first - the
  // customer's "statement". Credit-sale entries carry a reference back to
  // the sale so the UI can show what was actually bought, not just a total.
  async findTransactions(id: string) {
    await this.findOne(id);
    const txns = await this.prisma.customerTransaction.findMany({
      where: { customerId: id },
      orderBy: { createdAt: 'desc' },
    });

    // Attach line items for credit sales so the statement can show
    // "Castel Beer x5" instead of just an amount.
    const saleIds = txns.filter((t) => t.referenceType === 'SALE' && t.saleId).map((t) => t.saleId!);
    const sales = saleIds.length
      ? await this.prisma.sale.findMany({
          where: { id: { in: saleIds } },
          include: { items: { include: { product: true } } },
        })
      : [];
    const saleById = new Map(sales.map((s) => [s.id, s]));

    return txns.map((t) => ({
      id: t.id,
      transactionType: t.transactionType,
      amount: Number(t.amount),
      description: t.description,
      createdAt: t.createdAt,
      items: t.saleId
        ? (saleById.get(t.saleId)?.items ?? []).map((i) => ({
            product: i.product.name,
            quantity: Number(i.quantity),
            total: Number(i.total),
          }))
        : [],
    }));
  }

  // Outstanding balance = Credit Sales - Payments (+/- adjustments), derived
  // from the ledger - never a directly editable field.
  async getBalance(id: string) {
    const customer = await this.findOne(id);
    const result = await this.prisma.customerTransaction.groupBy({
      by: ['transactionType'],
      where: { customerId: id },
      _sum: { amount: true },
    });

    const creditSales = Number(result.find((r) => r.transactionType === 'CREDIT_SALE')?._sum.amount ?? 0);
    const payments = Number(result.find((r) => r.transactionType === 'PAYMENT')?._sum.amount ?? 0);
    const adjustments = Number(result.find((r) => r.transactionType === 'ADJUSTMENT')?._sum.amount ?? 0);
    const outstanding = creditSales - payments + adjustments;

    // "Last modified" for a customer's account = the most recent bill or
    // payment, not just when the profile fields (name/phone) were edited.
    const lastTxn = await this.prisma.customerTransaction.findFirst({
      where: { customerId: id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, amount: true, transactionType: true },
    });
    const lastActivityAt = lastTxn && lastTxn.createdAt > customer.updatedAt ? lastTxn.createdAt : customer.updatedAt;

    return {
      customerId: id,
      creditLimit: Number(customer.creditLimit),
      creditSales,
      payments,
      adjustments,
      outstanding,
      lastActivityAt,
      lastTransaction: lastTxn ? { amount: Number(lastTxn.amount), transactionType: lastTxn.transactionType } : null,
    };
  }

  // Sum of every customer's outstanding balance in one query, for the
  // "total owed across all customers" figure shown next to the search bar.
  async getTotalOutstanding() {
    const result = await this.prisma.customerTransaction.groupBy({
      by: ['transactionType'],
      _sum: { amount: true },
    });
    const sum = (t: string) => Number(result.find((r) => r.transactionType === t)?._sum.amount ?? 0);
    const total = sum('CREDIT_SALE') - sum('PAYMENT') + sum('ADJUSTMENT');
    return { totalOutstanding: total };
  }

  async assertWithinCreditLimit(id: string, additionalAmount: number) {
    const balance = await this.getBalance(id);
    if (balance.creditLimit > 0 && balance.outstanding + additionalAmount > balance.creditLimit) {
      throw new BadRequestException(
        `Credit limit exceeded: outstanding ${balance.outstanding} + ${additionalAmount} > limit ${balance.creditLimit}`,
      );
    }
  }

  async recordPayment(id: string, amount: number, actorId: string, description?: string) {
    await this.findOne(id);
    const txn = await this.prisma.customerTransaction.create({
      data: { customerId: id, transactionType: 'PAYMENT', amount, description },
    });
    await this.auditService.log({
      userId: actorId,
      action: 'CUSTOMER_PAYMENT',
      entityType: 'Customer',
      entityId: id,
      newValues: { amount, description },
    });
    return txn;
  }
}
