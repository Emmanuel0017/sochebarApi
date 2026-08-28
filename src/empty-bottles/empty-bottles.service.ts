import { BadRequestException, Injectable } from '@nestjs/common';
import { EmptyBottleTransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RecordEmptyBottleDto } from './dto/empty-bottle.dto';

// Collecting an empty adds to the count on hand; returning it to the
// supplier (for deposit) or it getting broken removes from the count.
// ADJUSTMENT carries whatever sign the physical recount implies.
const DECREASE_TYPES: EmptyBottleTransactionType[] = ['RETURNED_TO_SUPPLIER', 'BROKEN'];

@Injectable()
export class EmptyBottlesService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  async getSummary() {
    const products = await this.prisma.product.findMany({
      where: { tracksEmptyBottles: true, isActive: true },
    });

    const results: Array<{ productId: string; name: string; count: number }> = [];
    for (const p of products) {
      const agg = await this.prisma.emptyBottleTransaction.aggregate({
        where: { productId: p.id },
        _sum: { quantity: true },
      });
      results.push({ productId: p.id, name: p.name, count: agg._sum.quantity ?? 0 });
    }
    return results;
  }

  getHistory(productId: string) {
    return this.prisma.emptyBottleTransaction.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { createdBy: { select: { id: true, name: true } } },
    });
  }

  async record(dto: RecordEmptyBottleDto, actorId: string) {
    if (dto.transactionType === 'ADJUSTMENT' && dto.quantity === 0) {
      throw new BadRequestException('Adjustment quantity cannot be zero');
    }
    if (dto.transactionType !== 'ADJUSTMENT' && dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive number');
    }

    const signedQuantity =
      dto.transactionType === 'ADJUSTMENT'
        ? dto.quantity // caller passes the signed delta directly for a recount
        : DECREASE_TYPES.includes(dto.transactionType)
          ? -Math.abs(dto.quantity)
          : Math.abs(dto.quantity);

    const txn = await this.prisma.emptyBottleTransaction.create({
      data: {
        productId: dto.productId,
        transactionType: dto.transactionType,
        quantity: signedQuantity,
        notes: dto.notes,
        createdById: actorId,
      },
    });

    await this.auditService.log({
      userId: actorId,
      action: 'EMPTY_BOTTLE_TRANSACTION',
      entityType: 'EmptyBottleTransaction',
      entityId: txn.id,
      newValues: dto,
    });

    return txn;
  }
}
