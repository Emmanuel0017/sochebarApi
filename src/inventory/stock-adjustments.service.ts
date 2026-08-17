import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from './inventory.service';
import { AuditService } from '../audit/audit.service';
import { CreateStockAdjustmentDto } from './dto/inventory.dto';

// Adjustments above this many base units require manager/admin approval
// before the resulting inventory transaction is posted (see AUDIT rule:
// "High-value adjustments require manager approval").
const APPROVAL_THRESHOLD = 10;

@Injectable()
export class StockAdjustmentsService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
    private auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.stockAdjustment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true, createdBy: { select: { id: true, name: true } }, approvedBy: { select: { id: true, name: true } } },
    });
  }

  async create(dto: CreateStockAdjustmentDto, actorId: string, actorRole: string) {
    return this.prisma.$transaction(async (tx) => {
      const unit = await tx.productUnit.findUniqueOrThrow({ where: { id: dto.unitId } });
      const currentStockBase = await this.inventoryService.getCurrentStock(dto.productId, tx as any);
      const physicalBase = dto.physicalQuantity * Number(unit.quantityInBaseUnit);
      const differenceBase = physicalBase - currentStockBase;

      const requiresApproval = Math.abs(differenceBase) > APPROVAL_THRESHOLD;
      const isManagerOrAbove = actorRole === 'ADMIN' || actorRole === 'MANAGER';
      const approvedById = requiresApproval ? (isManagerOrAbove ? actorId : null) : actorId;

      const adjustment = await tx.stockAdjustment.create({
        data: {
          productId: dto.productId,
          systemQuantity: currentStockBase,
          physicalQuantity: physicalBase,
          difference: differenceBase,
          reason: dto.reason,
          notes: dto.notes,
          createdById: actorId,
          approvedById: approvedById ?? undefined,
        },
      });

      // Only post the inventory transaction if approved (self-approved when
      // within threshold, or approved by a manager/admin when above it).
      if (approvedById) {
        await this.inventoryService.recordMovement(
          {
            productId: dto.productId,
            unitId: dto.unitId,
            transactionType: 'ADJUSTMENT',
            quantityInUnit: differenceBase / Number(unit.quantityInBaseUnit),
            referenceType: 'STOCK_ADJUSTMENT',
            referenceId: adjustment.id,
            createdById: actorId,
          },
          tx as any,
        );
      }

      await this.auditService.log({
        userId: actorId,
        action: 'STOCK_ADJUSTMENT',
        entityType: 'StockAdjustment',
        entityId: adjustment.id,
        newValues: { differenceBase, reason: dto.reason, pendingApproval: !approvedById },
      });

      return { ...adjustment, pendingApproval: !approvedById };
    });
  }

  async approve(id: string, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      const adjustment = await tx.stockAdjustment.update({
        where: { id },
        data: { approvedById: actorId },
      });

      await this.inventoryService.recordMovement(
        {
          productId: adjustment.productId,
          unitId: (await tx.product.findUnique({ where: { id: adjustment.productId }, include: { units: { where: { isBaseUnit: true } } } }))!
            .units[0].id,
          transactionType: 'ADJUSTMENT',
          quantityInUnit: Number(adjustment.difference),
          referenceType: 'STOCK_ADJUSTMENT',
          referenceId: adjustment.id,
          createdById: actorId,
        },
        tx as any,
      );

      await this.auditService.log({
        userId: actorId,
        action: 'APPROVE_STOCK_ADJUSTMENT',
        entityType: 'StockAdjustment',
        entityId: id,
      });

      return adjustment;
    });
  }
}
