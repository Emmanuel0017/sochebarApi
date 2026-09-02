import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProductDto, DeactivateProductDto, DeleteProductDto, UpdateProductDto } from './dto/product.dto';

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
      // Current price only (effectiveTo null = still active), so list/POS
      // views can show "what does this sell for right now" without a
      // second round trip per product.
      include: { category: true, units: true, prices: { where: { effectiveTo: null }, include: { unit: true } } },
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

  async remove(id: string, dto: DeleteProductDto, actorId: string) {
    const product = await this.findOne(id);

    // A product's sale/purchase/stock history references it by productId
    // with no name/price snapshot elsewhere, so hard-deleting a product that
    // has ANY history would silently corrupt those past records (reports
    // would show "Unknown product" or fail outright). Only allow a true,
    // permanent delete when there's nothing referencing it yet - e.g. a
    // duplicate or typo created moments ago. Anything with real history can
    // only be deactivated (see deactivate() below), which keeps it out of
    // the POS/lists while leaving every past record intact.
    const [saleItems, purchaseItems, inventoryTxns, stockAdjustments, wastage, emptyBottleTxns] = await Promise.all([
      this.prisma.saleItem.count({ where: { productId: id } }),
      this.prisma.purchaseItem.count({ where: { productId: id } }),
      this.prisma.inventoryTransaction.count({ where: { productId: id } }),
      this.prisma.stockAdjustment.count({ where: { productId: id } }),
      this.prisma.wastage.count({ where: { productId: id } }),
      this.prisma.emptyBottleTransaction.count({ where: { productId: id } }),
    ]);
    const hasHistory = saleItems + purchaseItems + inventoryTxns + stockAdjustments + wastage + emptyBottleTxns > 0;

    if (hasHistory) {
      throw new BadRequestException(
        `"${product.name}" has recorded sales, purchases, or stock activity and can't be permanently deleted - ` +
          `that history has to stay intact for reporting. Deactivate it instead to hide it from the POS and product lists.`,
      );
    }

    // Clean up records that only exist to configure this product (units,
    // prices) before removing it, then delete the product itself.
    await this.prisma.$transaction([
      this.prisma.productPrice.deleteMany({ where: { productId: id } }),
      this.prisma.productUnit.deleteMany({ where: { productId: id } }),
      this.prisma.product.delete({ where: { id } }),
    ]);

    await this.auditService.log({
      userId: actorId,
      action: 'DELETE_PRODUCT',
      entityType: 'Product',
      entityId: id,
      // The row is gone, so the audit log is now the only place this
      // product's basic details survive - keep a snapshot plus the reason.
      oldValues: product,
      newValues: { reason: dto.reason, productName: product.name },
    });

    return { success: true };
  }

  async deactivate(id: string, dto: DeactivateProductDto, actorId: string) {
    const before = await this.findOne(id);
    if (!before.isActive) {
      throw new BadRequestException(`"${before.name}" is already inactive`);
    }
    const product = await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    await this.auditService.log({
      userId: actorId,
      action: 'DEACTIVATE_PRODUCT',
      entityType: 'Product',
      entityId: id,
      newValues: { reason: dto.reason, productName: before.name },
    });
    return product;
  }

  async reactivate(id: string, actorId: string) {
    const before = await this.findOne(id);
    const product = await this.prisma.product.update({ where: { id }, data: { isActive: true } });
    await this.auditService.log({
      userId: actorId,
      action: 'REACTIVATE_PRODUCT',
      entityType: 'Product',
      entityId: id,
      newValues: { productName: before.name },
    });
    return product;
  }
}
