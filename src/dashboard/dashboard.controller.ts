import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

// No @Roles() here on purpose: every route in this controller is a GET, and
// RolesGuard already blocks VIEWER from every mutating method regardless of
// @Roles(). A class-level ADMIN/MANAGER restriction would additionally block
// VIEWER from reading the dashboard, which contradicts "view everything,
// change nothing" — the whole point of that role.
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  summary() {
    return this.dashboardService.summary();
  }

  @Get('sales')
  sales() {
    return this.dashboardService.sales();
  }

  @Get('stock-alerts')
  stockAlerts() {
    return this.dashboardService.stockAlerts();
  }

  @Get('cash')
  cash() {
    return this.dashboardService.cash();
  }

  @Get('monthly')
  monthly(@Query('months') months?: string) {
    return this.dashboardService.monthly(months ? Number(months) : undefined);
  }
}