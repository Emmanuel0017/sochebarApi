import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CloseSessionDto, CreateCashTransactionDto, OpenSessionDto } from './dto/cash.dto';

@Injectable()
export class CashService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  async getCurrentSession(userId: string) {
    return this.prisma.cashSession.findFirst({
      where: { userId, status: 'OPEN' },
      include: { cashTransactions: true },
    });
  }

  async openSession(userId: string, dto: OpenSessionDto) {
    const existing = await this.getCurrentSession(userId);
    if (existing) throw new BadRequestException('A cash session is already open for this user');

    const session = await this.prisma.cashSession.create({
      data: { userId, openingCash: dto.openingCash },
    });

    await this.prisma.cashTransaction.create({
      data: {
        cashSessionId: session.id,
        transactionType: 'OPENING_BALANCE',
        amount: dto.openingCash,
        description: 'Session opened',
        createdById: userId,
      },
    });

    await this.auditService.log({
      userId,
      action: 'OPEN_CASH_SESSION',
      entityType: 'CashSession',
      entityId: session.id,
      newValues: { openingCash: dto.openingCash },
    });

    return session;
  }

  /**
   * Expected cash = Opening + Cash Sales + Deposits - Expenses - Withdrawals - Refunds
   * (design doc section 22).
   */
  async computeExpectedCash(sessionId: string): Promise<number> {
    const session = await this.prisma.cashSession.findUniqueOrThrow({ where: { id: sessionId } });
    const txns = await this.prisma.cashTransaction.groupBy({
      by: ['transactionType'],
      where: { cashSessionId: sessionId },
      _sum: { amount: true },
    });

    const sum = (type: string) => Number(txns.find((t) => t.transactionType === type)?._sum.amount ?? 0);

    const expected =
      Number(session.openingCash) +
      sum('SALE') +
      sum('DEPOSIT') -
      sum('EXPENSE') -
      sum('WITHDRAWAL') -
      sum('REFUND') +
      sum('ADJUSTMENT');

    return expected;
  }

  async closeSession(sessionId: string, dto: CloseSessionDto, actorId: string) {
    const session = await this.prisma.cashSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Cash session not found');
    if (session.status === 'CLOSED') throw new BadRequestException('Session already closed');

    const expectedCash = await this.computeExpectedCash(sessionId);
    const difference = dto.actualCash - expectedCash;

    const updated = await this.prisma.cashSession.update({
      where: { id: sessionId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        expectedCash,
        actualCash: dto.actualCash,
        difference,
      },
    });

    await this.auditService.log({
      userId: actorId,
      action: 'CLOSE_CASH_SESSION',
      entityType: 'CashSession',
      entityId: sessionId,
      newValues: { expectedCash, actualCash: dto.actualCash, difference },
    });

    // A non-zero difference is recorded, not hidden - the manager reviews it
    // via the cash report / dashboard reconciliation widget.
    return { ...updated, flagged: Math.abs(difference) > 0 };
  }

  async getTransactions(sessionId: string) {
    return this.prisma.cashTransaction.findMany({
      where: { cashSessionId: sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async recordTransaction(sessionId: string, dto: CreateCashTransactionDto, actorId: string) {
    const session = await this.prisma.cashSession.findUnique({ where: { id: sessionId } });
    if (!session || session.status !== 'OPEN') {
      throw new BadRequestException('Cash session is not open');
    }
    return this.prisma.cashTransaction.create({
      data: {
        cashSessionId: sessionId,
        transactionType: dto.transactionType,
        amount: dto.amount,
        description: dto.description,
        createdById: actorId,
      },
    });
  }
}
