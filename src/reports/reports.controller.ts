import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReportsService } from './reports.service';

// No @Roles() here on purpose — see DashboardController for the reasoning.
// Every route below is a GET; a class-level ADMIN/MANAGER restriction would
// block VIEWER from reading reports, contradicting the read-only owner role.
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily-sales')
  dailySales(@Query('date') date: string) {
    return this.reportsService.dailySales(date ?? new Date().toISOString().slice(0, 10));
  }

  @Get('daily-sheet')
  dailySheet(@Query('date') date: string) {
    return this.reportsService.getDailySheet(date ?? new Date().toISOString().slice(0, 10));
  }

  @Get('sales')
  productSales(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.productSales(from, to);
  }

  @Get('inventory')
  inventory(@Query('productId') productId?: string) {
    return this.reportsService.inventory(productId);
  }

  @Get('purchases')
  purchases(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.purchases(from, to);
  }

  @Get('expenses')
  expenses(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.expenses(from, to);
  }

  @Get('cash')
  cash(@Query('sessionId') sessionId: string) {
    return this.reportsService.cash(sessionId);
  }

  @Get('profit')
  profit(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.profit(from, to);
  }

  @Get('customer-credit')
  customerCredit(@Query('customerIds') customerIds?: string) {
    const ids = customerIds ? customerIds.split(',').filter(Boolean) : undefined;
    return this.reportsService.customerCredit(ids);
  }

  @Get('bills')
  bills(@Query('date') date: string) {
    return this.reportsService.bills(date ?? new Date().toISOString().slice(0, 10));
  }

  @Get('supplier-credit')
  supplierCredit() {
    return this.reportsService.supplierDebt();
  }

  @Get('pl-statement')
  plStatement(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.plStatement(from, to);
  }

  @Get('balance-sheet')
  balanceSheet(@Query('asOfDate') asOfDate?: string) {
    return this.reportsService.balanceSheet(asOfDate);
  }

  @Get('capital-accounts')
  capitalAccounts() {
    return this.reportsService.capitalAccountsSummary();
  }

  @Get('cash-book')
  cashBook(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.cashBook(from, to);
  }
}