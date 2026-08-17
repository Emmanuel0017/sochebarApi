import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER')
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
}
