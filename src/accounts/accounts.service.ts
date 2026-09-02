import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  CreateCapitalTransactionDto,
  CreateCashAccountDto,
  CreateCashAccountTransactionDto,
  CreateFixedAssetDto,
  CreatePartnerDto,
  TransferCashDto,
} from './dto/accounts.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  // ---------------- Partners / Capital accounts ----------------
  findAllPartners() {
    return this.prisma.partner.findMany({ orderBy: { name: 'asc' } });
  }

  createPartner(dto: CreatePartnerDto) {
    return this.prisma.partner.create({ data: dto });
  }

  findCapitalTransactions(partnerId?: string) {
    return this.prisma.capitalTransaction.findMany({
      where: { partnerId },
      include: { partner: true },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async createCapitalTransaction(dto: CreateCapitalTransactionDto, actorId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id: dto.partnerId } });
    if (!partner) throw new NotFoundException('Partner not found');

    if (dto.stockValue != null && dto.stockValue > dto.amount) {
      throw new BadRequestException('Stock value cannot be more than the total amount');
    }

    const txn = await this.prisma.capitalTransaction.create({
      data: {
        partnerId: dto.partnerId,
        transactionType: dto.transactionType,
        description: dto.description,
        amount: dto.amount,
        stockValue: dto.stockValue,
        transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
        createdById: actorId,
      },
    });

    await this.auditService.log({
      userId: actorId,
      action: 'CREATE_CAPITAL_TRANSACTION',
      entityType: 'CapitalTransaction',
      entityId: txn.id,
      newValues: { ...dto, partnerName: partner.name },
    });

    return txn;
  }

  // ---------------- Fixed assets ----------------
  findAllFixedAssets() {
    return this.prisma.fixedAsset.findMany({ orderBy: { acquiredDate: 'desc' } });
  }

  async createFixedAsset(dto: CreateFixedAssetDto, actorId: string) {
    const asset = await this.prisma.fixedAsset.create({
      data: {
        name: dto.name,
        cost: dto.cost,
        acquiredDate: dto.acquiredDate ? new Date(dto.acquiredDate) : undefined,
        notes: dto.notes,
        createdById: actorId,
      },
    });

    await this.auditService.log({
      userId: actorId,
      action: 'CREATE_FIXED_ASSET',
      entityType: 'FixedAsset',
      entityId: asset.id,
      newValues: dto,
    });

    return asset;
  }

  // ---------------- Cash accounts (Bank / Mobile Money / Petty Cash) ----------------
  findAllCashAccounts() {
    return this.prisma.cashAccount.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  createCashAccount(dto: CreateCashAccountDto) {
    return this.prisma.cashAccount.create({ data: dto });
  }

  async cashAccountBalance(cashAccountId: string) {
    const account = await this.prisma.cashAccount.findUnique({ where: { id: cashAccountId } });
    if (!account) throw new NotFoundException('Cash account not found');

    const agg = await this.prisma.cashAccountTransaction.aggregate({
      where: { cashAccountId },
      _sum: { amount: true },
    });

    return { ...account, balance: Number(agg._sum.amount ?? 0) };
  }

  findCashAccountTransactions(cashAccountId?: string, from?: string, to?: string) {
    return this.prisma.cashAccountTransaction.findMany({
      where: {
        cashAccountId,
        transactionDate:
          from || to
            ? { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined }
            : undefined,
      },
      include: { cashAccount: true },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async createCashAccountTransaction(dto: CreateCashAccountTransactionDto, actorId: string) {
    const account = await this.prisma.cashAccount.findUnique({ where: { id: dto.cashAccountId } });
    if (!account) throw new NotFoundException('Cash account not found');

    const txn = await this.prisma.cashAccountTransaction.create({
      data: {
        cashAccountId: dto.cashAccountId,
        transactionType: dto.transactionType,
        amount: dto.amount,
        description: dto.description,
        transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
        createdById: actorId,
      },
    });

    await this.auditService.log({
      userId: actorId,
      action: 'CREATE_CASH_ACCOUNT_TRANSACTION',
      entityType: 'CashAccountTransaction',
      entityId: txn.id,
      newValues: dto,
    });

    return txn;
  }

  // "Banked cash": moving petty cash into the bank, or any account-to-account
  // transfer. Posts a matched pair of TRANSFER_OUT/TRANSFER_IN transactions
  // so each account's own ledger stays self-consistent.
  async transferCash(dto: TransferCashDto, actorId: string) {
    if (dto.fromCashAccountId === dto.toCashAccountId) {
      throw new BadRequestException('fromCashAccountId and toCashAccountId must differ');
    }
    const [from, to] = await Promise.all([
      this.prisma.cashAccount.findUnique({ where: { id: dto.fromCashAccountId } }),
      this.prisma.cashAccount.findUnique({ where: { id: dto.toCashAccountId } }),
    ]);
    if (!from || !to) throw new NotFoundException('Cash account not found');

    const transactionDate = dto.transactionDate ? new Date(dto.transactionDate) : new Date();

    return this.prisma.$transaction(async (tx) => {
      const out = await tx.cashAccountTransaction.create({
        data: {
          cashAccountId: from.id,
          transactionType: 'TRANSFER_OUT',
          amount: -Math.abs(dto.amount),
          description: dto.description ?? `Transfer to ${to.name}`,
          transactionDate,
          createdById: actorId,
        },
      });
      const inTxn = await tx.cashAccountTransaction.create({
        data: {
          cashAccountId: to.id,
          transactionType: 'TRANSFER_IN',
          amount: Math.abs(dto.amount),
          description: dto.description ?? `Transfer from ${from.name}`,
          transactionDate,
          createdById: actorId,
        },
      });

      await this.auditService.log({
        userId: actorId,
        action: 'TRANSFER_CASH',
        entityType: 'CashAccountTransaction',
        entityId: out.id,
        newValues: dto,
      });

      return { out, in: inTxn };
    });
  }
}
