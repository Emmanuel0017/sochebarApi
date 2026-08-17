import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private auditService: AuditService) {}

  findAll(params: { categoryId?: string; search?: string; isActive?: boolean }) {
    return this.prisma.product.findMany({
      where: {
        categoryId: params.categoryId,
        isActive: params.isActive,
        OR: params.search
          ? [
              { name: { contains: params.search, mode: 'insensitive' } },
              { sku: { contains: params.search, mode: 'insensitive' } },
              { barcode: { contains: params.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      include: { category: true, units: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, units: true, prices: { orderBy: { effectiveFrom: 'desc' }, take: 10 } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findByBarcode(barcode: string) {
    const product = await this.prisma.product.findUnique({ where: { barcode }, include: { units: true } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto, actorId: string) {
    const product = await this.prisma.product.create({ data: dto });
    await this.auditService.log({
      userId: actorId,
      action: 'CREATE_PRODUCT',
      entityType: 'Product',
      entityId: product.id,
      newValues: dto,
    });
    return product;
  }

  async update(id: string, dto: UpdateProductDto, actorId: string) {
    const before = await this.findOne(id);
    const product = await this.prisma.product.update({ where: { id }, data: dto });
    await this.auditService.log({
      userId: actorId,
      action: 'UPDATE_PRODUCT',
      entityType: 'Product',
      entityId: id,
      oldValues: before,
      newValues: dto,
    });
    return product;
  }

  async remove(id: string, actorId: string) {
    await this.findOne(id);
    // Soft-delete pattern: products with sales/purchase history should not be
    // hard-deleted. We deactivate instead so historical records remain valid.
    const product = await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    await this.auditService.log({
      userId: actorId,
      action: 'DEACTIVATE_PRODUCT',
      entityType: 'Product',
      entityId: id,
    });
    return product;
  }
}
