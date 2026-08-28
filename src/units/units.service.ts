import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  findAllForProduct(productId: string) {
    return this.prisma.productUnit.findMany({ where: { productId } });
  }

  async findOne(id: string) {
    const unit = await this.prisma.productUnit.findUnique({ where: { id } });
    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  async create(dto: CreateUnitDto, actorId: string) {
    const unit = await this.prisma.productUnit.create({ data: dto });
    await this.auditService.log({
      userId: actorId,
      action: 'CREATE_UNIT',
      entityType: 'ProductUnit',
      entityId: unit.id,
      newValues: dto,
    });
    return unit;
  }

  async update(id: string, dto: UpdateUnitDto, actorId: string) {
    const before = await this.findOne(id);
    const unit = await this.prisma.productUnit.update({ where: { id }, data: dto });
    await this.auditService.log({
      userId: actorId,
      action: 'UPDATE_UNIT',
      entityType: 'ProductUnit',
      entityId: id,
      oldValues: before,
      newValues: dto,
    });
    return unit;
  }

  async remove(id: string, actorId: string) {
    const before = await this.findOne(id);
    try {
      const unit = await this.prisma.productUnit.delete({ where: { id } });
      await this.auditService.log({
        userId: actorId,
        action: 'DELETE_UNIT',
        entityType: 'ProductUnit',
        entityId: id,
        oldValues: before,
      });
      return unit;
    } catch (err: any) {
      // FK constraint failure - this unit has been referenced by real
      // purchase/sale/inventory/price history and deleting it would corrupt
      // those records. Give a clear explanation instead of a raw DB error.
      if (err?.code === 'P2003') {
        throw new BadRequestException(
          'This unit has already been used in purchases, sales, or price history and cannot be deleted. ' +
            'If it is no longer in use, edit it instead of removing it, or deactivate the product.',
        );
      }
      throw err;
    }
  }

  // Convert a quantity expressed in a given unit to the product's base unit quantity.
  async toBaseQuantity(unitId: string, quantity: number): Promise<number> {
    const unit = await this.findOne(unitId);
    return quantity * Number(unit.quantityInBaseUnit);
  }
}
