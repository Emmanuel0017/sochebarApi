import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function dateRange(from?: string, to?: string) {
  return {
    gte: from ? new Date(from) : undefined,
    lte: to ? new Date(to) : undefined,
  };
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // ---------------- Daily sales report ----------------
  async dailySales(date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const sales = await this.prisma.sale.findMany({
      where: { saleDate: { gte: start, lte: end }, status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] } },
      include: { payments: true },
    });

    const totalSales = sales.reduce((s, sale) => s + Number(sale.total), 0);
    const discounts = sales.reduce((s, sale) => s + Number(sale.discount), 0);

    const byMethod: Record<string, number> = {};
    for (const sale of sales) {
      for (const p of sale.payments) {
        byMethod[p.paymentMethod] = (byMethod[p.paymentMethod] ?? 0) + Number(p.amount);
      }
    }

    const refunds = await this.prisma.sale.aggregate({
      where: { saleDate: { gte: start, lte: end }, status: { in: ['REFUNDED', 'PARTIALLY_REFUNDED', 'VOIDED'] } },
      _sum: { total: true },
    });

    return {
      date,
      totalSales,
      discounts,
      refunds: Number(refunds._sum.total ?? 0),
      payments: {
        cash: byMethod.CASH ?? 0,
        airtelMoney: byMethod.AIRTEL_MONEY ?? 0,
        mpamba: byMethod.MPAMBA ?? 0,
        bank: byMethod.BANK ?? 0,
        credit: byMethod.CREDIT ?? 0,
        other: byMethod.OTHER ?? 0,
      },
    };
  }

  // ---------------- Product sales report ----------------
  async productSales(from?: string, to?: string) {
    const items = await this.prisma.saleItem.findMany({
      where: { sale: { status: 'COMPLETED', saleDate: dateRange(from, to) } },
      include: { product: true },
    });

    const map = new Map<string, { productId: string; name: string; qty: number; revenue: number }>();
    for (const item of items) {
      const key = item.productId;
      const entry = map.get(key) ?? { productId: key, name: item.product.name, qty: 0, revenue: 0 };
      entry.qty += Number(item.quantity);
      entry.revenue += Number(item.total);
      map.set(key, entry);
    }

    // Approximate cost via most recent purchase unit cost for that product.
    const results: Array<{
      productId: string;
      name: string;
      qty: number;
      revenue: number;
      cost: number;
      grossProfit: number;
      marginPercent: number;
    }> = [];
    for (const entry of map.values()) {
      const lastPurchase = await this.prisma.purchaseItem.findFirst({
        where: { productId: entry.productId },
        orderBy: { id: 'desc' },
      });
      const unitCost = lastPurchase ? Number(lastPurchase.unitCost) : 0;
      const cost = unitCost * entry.qty;
      const grossProfit = entry.revenue - cost;
      const margin = entry.revenue > 0 ? (grossProfit / entry.revenue) * 100 : 0;
      results.push({ ...entry, cost, grossProfit, marginPercent: Number(margin.toFixed(2)) });
    }

    return results.sort((a, b) => b.revenue - a.revenue);
  }

  // ---------------- Inventory report ----------------
  async inventory(productId?: string) {
    const products = await this.prisma.product.findMany({
      where: { id: productId, trackInventory: true },
      include: { units: { where: { isBaseUnit: true } } },
    });

    const results: Array<{
      productId: string;
      name: string;
      baseUnit: string;
      purchases: number;
      sales: number;
      wastage: number;
      adjustments: number;
      expectedStock: number;
    }> = [];
    for (const p of products) {
      const agg = await this.prisma.inventoryTransaction.groupBy({
        by: ['transactionType'],
        where: { productId: p.id },
        _sum: { quantity: true },
      });

      const sum = (t: string) => Number(agg.find((a) => a.transactionType === t)?._sum.quantity ?? 0);
      const purchases = sum('PURCHASE');
      const sales = Math.abs(sum('SALE'));
      const wastage = Math.abs(sum('WASTAGE'));
      const adjustments = sum('ADJUSTMENT');
      const returns = sum('RETURN');
      const expectedStock = purchases + sales * -1 + wastage * -1 + adjustments + returns;

      results.push({
        productId: p.id,
        name: p.name,
        baseUnit: p.units[0]?.name ?? 'unit',
        purchases,
        sales,
        wastage,
        adjustments,
        expectedStock,
      });
    }
    return results;
  }

  // ---------------- Purchase report ----------------
  async purchases(from?: string, to?: string) {
    const purchases = await this.prisma.purchase.findMany({
      where: { purchaseDate: dateRange(from, to) },
      include: { supplier: true },
    });

    const map = new Map<string, { supplierId: string; name: string; count: number; total: number; paid: number }>();
    for (const p of purchases) {
      const entry = map.get(p.supplierId) ?? {
        supplierId: p.supplierId,
        name: p.supplier.name,
        count: 0,
        total: 0,
        paid: 0,
      };
      entry.count += 1;
      entry.total += Number(p.total);
      entry.paid += Number(p.amountPaid);
      map.set(p.supplierId, entry);
    }

    return Array.from(map.values()).map((e) => ({ ...e, outstanding: e.total - e.paid }));
  }

  // ---------------- Expense report ----------------
  async expenses(from?: string, to?: string) {
    const grouped = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { expenseDate: dateRange(from, to) },
      _sum: { amount: true },
    });

    const categories = await this.prisma.expenseCategory.findMany();
    return grouped.map((g) => ({
      category: categories.find((c) => c.id === g.categoryId)?.name ?? 'Unknown',
      totalAmount: Number(g._sum.amount ?? 0),
    }));
  }

  // ---------------- Cash report ----------------
  async cash(sessionId: string) {
    const session = await this.prisma.cashSession.findUniqueOrThrow({ where: { id: sessionId } });
    const txns = await this.prisma.cashTransaction.groupBy({
      by: ['transactionType'],
      where: { cashSessionId: sessionId },
      _sum: { amount: true },
    });
    const sum = (t: string) => Number(txns.find((x) => x.transactionType === t)?._sum.amount ?? 0);

    return {
      openingCash: Number(session.openingCash),
      cashSales: sum('SALE'),
      cashExpenses: sum('EXPENSE'),
      withdrawals: sum('WITHDRAWAL'),
      deposits: sum('DEPOSIT'),
      expectedCash: session.expectedCash ? Number(session.expectedCash) : null,
      actualCash: session.actualCash ? Number(session.actualCash) : null,
      difference: session.difference ? Number(session.difference) : null,
    };
  }

  // ---------------- Credit report (customers) ----------------
  async customerCredit() {
    const customers = await this.prisma.customer.findMany();
    const results: Array<{ customer: string; creditSales: number; payments: number; outstanding: number }> = [];
    for (const c of customers) {
      const agg = await this.prisma.customerTransaction.groupBy({
        by: ['transactionType'],
        where: { customerId: c.id },
        _sum: { amount: true },
      });
      const sum = (t: string) => Number(agg.find((a) => a.transactionType === t)?._sum.amount ?? 0);
      const creditSales = sum('CREDIT_SALE');
      const payments = sum('PAYMENT');
      results.push({ customer: c.name, creditSales, payments, outstanding: creditSales - payments });
    }
    return results.filter((r) => r.creditSales !== 0 || r.outstanding !== 0);
  }

  // ---------------- Supplier debt report ----------------
  async supplierDebt() {
    const suppliers = await this.prisma.supplier.findMany();
    const results: Array<{ supplier: string; purchases: number; payments: number; outstanding: number }> = [];
    for (const s of suppliers) {
      const agg = await this.prisma.supplierTransaction.groupBy({
        by: ['transactionType'],
        where: { supplierId: s.id },
        _sum: { amount: true },
      });
      const sum = (t: string) => Number(agg.find((a) => a.transactionType === t)?._sum.amount ?? 0);
      const purchases = sum('PURCHASE');
      const payments = sum('PAYMENT');
      results.push({ supplier: s.name, purchases, payments, outstanding: purchases - payments });
    }
    return results.filter((r) => r.purchases !== 0 || r.outstanding !== 0);
  }

  // ---------------- Profit report ----------------
  async profit(from?: string, to?: string) {
    const productSales = await this.productSales(from, to);
    const revenue = productSales.reduce((s, p) => s + p.revenue, 0);
    const cogs = productSales.reduce((s, p) => s + p.cost, 0);
    const grossProfit = revenue - cogs;

    const expenseAgg = await this.prisma.expense.aggregate({
      where: { expenseDate: dateRange(from, to) },
      _sum: { amount: true },
    });
    const operatingExpenses = Number(expenseAgg._sum.amount ?? 0);
    const netProfit = grossProfit - operatingExpenses;

    return { revenue, cogs, grossProfit, operatingExpenses, netProfit };
  }
}
