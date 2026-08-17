import { Injectable, NotFoundException } from '@nestjs/common';
import { PriceType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriceDto, UpdatePriceDto } from './dto/price.dto';

@Injectable()
export class PricesService {
  constructor(private prisma: PrismaService) {}

  findAllForProduct(productId: string) {
    return this.prisma.productPrice.findMany({
      where: { productId },
      orderBy: { effectiveFrom: 'desc' },
      include: { unit: true },
    });
  }

  // Returns the currently active price for a product/unit/priceType combination.
  async getCurrentPrice(productId: string, unitId: string, priceType: PriceType = 'NORMAL') {
    const now = new Date();
    const price = await this.prisma.productPrice.findFirst({
      where: {
        productId,
        unitId,
        priceType,
        effectiveFrom: { lte: now },
        OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }],
      },
      orderBy: { effectiveFrom: 'desc' },
    });
    if (!price) throw new NotFoundException('No active price found for this product/unit');
    return price;
  }

  // Creating a new price closes out (sets effectiveTo) the previously active price
  // of the same product/unit/priceType, so history is preserved but only one is "current".
  async create(productId: string, dto: CreatePriceDto, createdById: string) {
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      await tx.productPrice.updateMany({
        where: {
          productId,
          unitId: dto.unitId,
          priceType: dto.priceType ?? 'NORMAL',
          effectiveTo: null,
        },
        data: { effectiveTo: now },
      });

      return tx.productPrice.create({
        data: {
          productId,
          unitId: dto.unitId,
          price: dto.price,
          priceType: dto.priceType ?? 'NORMAL',
          effectiveFrom: now,
          createdById,
        },
      });
    });
  }

  async update(id: string, dto: UpdatePriceDto) {
    const price = await this.prisma.productPrice.findUnique({ where: { id } });
    if (!price) throw new NotFoundException('Price not found');
    // Historical prices already used in completed sales must never be mutated in
    // a way that changes what was charged - only administrative metadata (like
    // closing the effective window early) is allowed here.
    return this.prisma.productPrice.update({
      where: { id },
      data: { effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined },
    });
  }
}
