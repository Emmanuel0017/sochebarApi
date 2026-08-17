import { Injectable, BadRequestException } from '@nestjs/common';
import { InventoryTransactionType, PrismaClient, ReferenceType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type Tx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export interface RecordMovementParams {
  productId: string;
  unitId: string;
  transactionType: InventoryTransactionType;
  // Quantity in the unit specified by unitId (NOT necessarily base unit).
  quantityInUnit: number;
  unitCost?: number;
  referenceType?: ReferenceType;
  referenceId?: string;
  purchaseId?: string;
  saleId?: string;
  createdById: string;
}

const STOCK_OUT_TYPES: InventoryTransactionType[] = ['SALE', 'WASTAGE', 'DAMAGE', 'TRANSFER_OUT'];

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Records a single stock movement as an immutable ledger entry.
   * Quantity is converted to the product's base unit and stored SIGNED:
   * positive = stock increase, negative = stock decrease.
   * ADJUSTMENT is the only type whose sign is taken directly from the caller
   * (since an adjustment can go either way) - all other types have a fixed
   * direction enforced here so callers can't accidentally reverse the sign.
   */
  async recordMovement(params: RecordMovementParams, client: Tx = this.prisma as any) {
    const unit = await client.productUnit.findUnique({ where: { id: params.unitId } });
    if (!unit) throw new BadRequestException('Invalid unit');

    const baseQuantity = params.quantityInUnit * Number(unit.quantityInBaseUnit);

    let signedQuantity: number;
    if (params.transactionType === 'ADJUSTMENT') {
      signedQuantity = baseQuantity; // caller passes signed value already
    } else if (STOCK_OUT_TYPES.includes(params.transactionType)) {
      signedQuantity = -Math.abs(baseQuantity);
    } else {
      signedQuantity = Math.abs(baseQuantity);
    }

    return client.inventoryTransaction.create({
      data: {
        productId: params.productId,
        unitId: params.unitId,
        transactionType: params.transactionType,
        quantity: signedQuantity,
        referenceType: params.referenceType,
        referenceId: params.referenceId,
        purchaseId: params.purchaseId,
        saleId: params.saleId,
        unitCost: params.unitCost,
        createdById: params.createdById,
      },
    });
  }

  /** Current stock on hand for a product, expressed in BASE units. */
  async getCurrentStock(productId: string, client: Tx = this.prisma as any): Promise<number> {
    const result = await client.inventoryTransaction.aggregate({
      where: { productId },
      _sum: { quantity: true },
    });
    return Number(result._sum.quantity ?? 0);
  }

  /** Checks whether there is enough stock (in base units) to fulfill a requested movement. */
  async assertSufficientStock(productId: string, requiredBaseQuantity: number, client: Tx = this.prisma as any) {
    const current = await this.getCurrentStock(productId, client);
    if (current < requiredBaseQuantity) {
      throw new BadRequestException(
        `Insufficient stock: have ${current}, need ${requiredBaseQuantity}`,
      );
    }
  }

  async getHistory(productId: string, take = 100, skip = 0) {
    return this.prisma.inventoryTransaction.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: { unit: true, createdBy: { select: { id: true, name: true } } },
    });
  }

  async getStockSummary() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, trackInventory: true },
      include: { units: { where: { isBaseUnit: true } } },
    });

    const summaries = await Promise.all(
      products.map(async (p) => {
        const stock = await this.getCurrentStock(p.id);
        return { productId: p.id, name: p.name, baseUnit: p.units[0]?.name ?? 'unit', stock };
      }),
    );
    return summaries;
  }
}
