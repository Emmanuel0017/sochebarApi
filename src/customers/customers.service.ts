import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({ where: { id }, data: dto });
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

    return { customerId: id, creditLimit: Number(customer.creditLimit), creditSales, payments, adjustments, outstanding };
  }

  async assertWithinCreditLimit(id: string, additionalAmount: number) {
    const balance = await this.getBalance(id);
    if (balance.creditLimit > 0 && balance.outstanding + additionalAmount > balance.creditLimit) {
      throw new BadRequestException(
        `Credit limit exceeded: outstanding ${balance.outstanding} + ${additionalAmount} > limit ${balance.creditLimit}`,
      );
    }
  }

  async recordPayment(id: string, amount: number, description?: string) {
    await this.findOne(id);
    return this.prisma.customerTransaction.create({
      data: { customerId: id, transactionType: 'PAYMENT', amount, description },
    });
  }
}
