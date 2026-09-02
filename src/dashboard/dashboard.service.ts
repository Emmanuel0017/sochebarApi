import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from '../reports/reports.service';
import { InventoryService } from '../inventory/inventory.service';

// A product is "LOW" if current stock is below this many base units.
// In production this would be a per-product `reorderLevel` field.
const LOW_STOCK_THRESHOLD = 20;

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private reportsService: ReportsService,
    private inventoryService: InventoryService,
  ) {}

  async summary() {
    const today = new Date().toISOString().slice(0, 10);
    const dailySales = await this.reportsService.dailySales(today);
    const profit = await this.reportsService.profit(today, today);

    return {
      date: today,
      sales: dailySales.totalSales,
      expenses: profit.operatingExpenses,
      netProfit: profit.netProfit,
      payments: dailySales.payments,
    };
  }

  async sales() {
    const today = new Date().toISOString().slice(0, 10);
    return this.reportsService.dailySales(today);
  }

  async stockAlerts() {
    const summary = await this.inventoryService.getStockSummary();
    return summary.map((s) => ({
      ...s,
      status: s.stock <= 0 ? 'OUT_OF_STOCK' : s.stock < LOW_STOCK_THRESHOLD ? 'LOW' : 'OK',
    }));
  }

  async cash() {
    const openSessions = await this.prisma.cashSession.findMany({ where: { status: 'OPEN' } });
    const results: Array<{ sessionId: string; userId: string } & Awaited<ReturnType<ReportsService['cash']>>> = [];
    for (const session of openSessions) {
      const report = await this.reportsService.cash(session.id);
      results.push({ sessionId: session.id, userId: session.userId, ...report });
    }
    return results;
  }

  // Monthly sales / purchases / expenses for the dashboard trend chart.
  // Grouped in the business's local timezone (UTC+2) so a late-night sale
  // lands in the right month the same way daily reports do - see
  // date-range.util.ts for why raw UTC would be wrong here.
  async monthly(months = 12) {
    const BUSINESS_OFFSET_MS = 2 * 60 * 60 * 1000;
    const monthKey = (d: Date) => {
      const shifted = new Date(d.getTime() + BUSINESS_OFFSET_MS);
      return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}`;
    };

    const since = new Date();
    since.setUTCMonth(since.getUTCMonth() - (months - 1));
    since.setUTCDate(1);
    since.setUTCHours(0, 0, 0, 0);

    const [sales, purchases, expenses] = await Promise.all([
      this.prisma.sale.findMany({
        where: { saleDate: { gte: since }, status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] } },
        select: { saleDate: true, total: true },
      }),
      this.prisma.purchase.findMany({
        where: { purchaseDate: { gte: since } },
        select: { purchaseDate: true, total: true },
      }),
      this.prisma.expense.findMany({
        where: { expenseDate: { gte: since } },
        select: { expenseDate: true, amount: true },
      }),
    ]);

    // Build the ordered list of month keys up front so months with zero
    // activity still show up as a bar/point at 0, instead of the chart's
    // x-axis silently skipping them.
    const keys: string[] = [];
    const cursor = new Date(since);
    for (let i = 0; i < months; i++) {
      keys.push(monthKey(cursor));
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    const totals = new Map(keys.map((k) => [k, { month: k, sales: 0, purchases: 0, expenses: 0 }]));
    for (const s of sales) totals.get(monthKey(s.saleDate))!.sales += Number(s.total);
    for (const p of purchases) totals.get(monthKey(p.purchaseDate))!.purchases += Number(p.total);
    for (const e of expenses) totals.get(monthKey(e.expenseDate))!.expenses += Number(e.amount);

    return keys.map((k) => totals.get(k)!);
  }
}
