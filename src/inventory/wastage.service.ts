import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from './inventory.service';
import { AuditService } from '../audit/audit.service';
import { CreateWastageDto } from './dto/inventory.dto';

@Injectable()
export class WastageService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
    private auditService: AuditService,
  ) {}

  findAll() {
    return this.prisma.wastage.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true, unit: true, recordedBy: { select: { id: true, name: true } } },
    });
  }

  async create(dto: CreateWastageDto, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      await this.inventoryService.assertSufficientStock(
        dto.productId,
        dto.quantity * (await tx.productUnit.findUniqueOrThrow({ where: { id: dto.unitId } })).quantityInBaseUnit.toNumber(),
        tx as any,
      );

      const wastage = await tx.wastage.create({
        data: {
          productId: dto.productId,
          unitId: dto.unitId,
          quantity: dto.quantity,
          reason: dto.reason,
          description: dto.description,
          recordedById: actorId,
        },
      });

      // Wastage NEVER simply disappears from inventory - it is always posted
      // as an explicit, traceable inventory transaction (see design rule #16).
      await this.inventoryService.recordMovement(
        {
          productId: dto.productId,
          unitId: dto.unitId,
          transactionType: 'WASTAGE',
          quantityInUnit: dto.quantity,
          referenceType: 'WASTAGE',
          referenceId: wastage.id,
          createdById: actorId,
        },
        tx as any,
      );

      await this.auditService.log({
        userId: actorId,
        action: 'RECORD_WASTAGE',
        entityType: 'Wastage',
        entityId: wastage.id,
        newValues: dto,
      });

      return wastage;
    });
  }

  async approve(id: string, actorId: string) {
    const wastage = await this.prisma.wastage.update({ where: { id }, data: { approvedById: actorId } });
    await this.auditService.log({
      userId: actorId,
      action: 'APPROVE_WASTAGE',
      entityType: 'Wastage',
      entityId: id,
    });
    return wastage;
  }
}
