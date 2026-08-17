import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  findAllForProduct(productId: string) {
    return this.prisma.productUnit.findMany({ where: { productId } });
  }

  async findOne(id: string) {
    const unit = await this.prisma.productUnit.findUnique({ where: { id } });
    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  create(dto: CreateUnitDto) {
    return this.prisma.productUnit.create({ data: dto });
  }

  async update(id: string, dto: UpdateUnitDto) {
    await this.findOne(id);
    return this.prisma.productUnit.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productUnit.delete({ where: { id } });
  }

  // Convert a quantity expressed in a given unit to the product's base unit quantity.
  async toBaseQuantity(unitId: string, quantity: number): Promise<number> {
    const unit = await this.findOne(unitId);
    return quantity * Number(unit.quantityInBaseUnit);
  }
}
