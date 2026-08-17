import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily-sales')
  dailySales(@Query('date') date: string) {
    return this.reportsService.dailySales(date ?? new Date().toISOString().slice(0, 10));
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
  customerCredit() {
    return this.reportsService.customerCredit();
  }

  @Get('supplier-credit')
  supplierCredit() {
    return this.reportsService.supplierDebt();
  }
}
