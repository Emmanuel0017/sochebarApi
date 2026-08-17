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
}
