import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.supplier.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({ data: dto });
  }

  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({ where: { id }, data: dto });
  }

  // Amount owed = credit purchases - payments (supplier_transactions ledger),
  // never a manually editable balance field.
  async getBalance(id: string) {
    await this.findOne(id);
    const result = await this.prisma.supplierTransaction.groupBy({
      by: ['transactionType'],
      where: { supplierId: id },
      _sum: { amount: true },
    });

    const purchases = Number(result.find((r) => r.transactionType === 'PURCHASE')?._sum.amount ?? 0);
    const payments = Number(result.find((r) => r.transactionType === 'PAYMENT')?._sum.amount ?? 0);
    const adjustments = Number(result.find((r) => r.transactionType === 'ADJUSTMENT')?._sum.amount ?? 0);
    const outstanding = purchases - payments + adjustments;

    return { supplierId: id, purchases, payments, adjustments, outstanding };
  }

  async recordPayment(id: string, amount: number, description?: string) {
    await this.findOne(id);
    return this.prisma.supplierTransaction.create({
      data: {
        supplierId: id,
        transactionType: 'PAYMENT',
        amount,
        description,
      },
    });
  }
}
