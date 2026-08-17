import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateExpenseCategoryDto, CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  findAllCategories() {
    return this.prisma.expenseCategory.findMany({ orderBy: { name: 'asc' } });
  }

  createCategory(dto: CreateExpenseCategoryDto) {
    return this.prisma.expenseCategory.create({ data: dto });
  }

  findAll(params: { categoryId?: string; from?: string; to?: string }) {
    return this.prisma.expense.findMany({
      where: {
        categoryId: params.categoryId,
        expenseDate:
          params.from || params.to
            ? { gte: params.from ? new Date(params.from) : undefined, lte: params.to ? new Date(params.to) : undefined }
            : undefined,
      },
      include: { category: true, createdBy: { select: { id: true, name: true } } },
      orderBy: { expenseDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findUnique({ where: { id }, include: { category: true } });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  /**
   * Every business expense must be recorded (design doc section 23).
   * A cash-method expense also posts a cash_transaction against the
   * specified open cash session, since cash spent must reduce expected cash.
   */
  async create(dto: CreateExpenseDto, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          categoryId: dto.categoryId,
          description: dto.description,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          reference: dto.reference,
          createdById: actorId,
        },
      });

      if (dto.paymentMethod === 'CASH') {
        if (!dto.cashSessionId) {
          throw new BadRequestException('cashSessionId is required for cash expenses');
        }
        const session = await tx.cashSession.findUnique({ where: { id: dto.cashSessionId } });
        if (!session || session.status !== 'OPEN') {
          throw new BadRequestException('Cash session is not open');
        }
        await tx.cashTransaction.create({
          data: {
            cashSessionId: dto.cashSessionId,
            transactionType: 'EXPENSE',
            amount: dto.amount,
            referenceType: 'MANUAL',
            referenceId: expense.id,
            expenseId: expense.id,
            description: dto.description,
            createdById: actorId,
          },
        });
      }

      await this.auditService.log({
        userId: actorId,
        action: 'CREATE_EXPENSE',
        entityType: 'Expense',
        entityId: expense.id,
        newValues: dto,
      });

      return expense;
    });
  }

  async update(id: string, dto: UpdateExpenseDto, actorId: string) {
    const before = await this.findOne(id);
    const expense = await this.prisma.expense.update({ where: { id }, data: dto });
    await this.auditService.log({
      userId: actorId,
      action: 'UPDATE_EXPENSE',
      entityType: 'Expense',
      entityId: id,
      oldValues: before,
      newValues: dto,
    });
    return expense;
  }
}
