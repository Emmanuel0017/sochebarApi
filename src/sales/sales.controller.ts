import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SalesService } from './sales.service';
import { CreateSaleDto, VoidSaleDto } from './dto/sale.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('userId') userId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.salesService.findAll({ status, userId, from, to });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'CASHIER', 'BARTENDER')
  create(@Body() dto: CreateSaleDto, @CurrentUser() user: any) {
    return this.salesService.create(dto, user.id, user.role);
  }

  @Post(':id/void')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  void(@Param('id') id: string, @Body() dto: VoidSaleDto, @CurrentUser() user: any) {
    return this.salesService.void(id, dto, user.id, user.role);
  }

  @Post(':id/refund')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  refund(@Param('id') id: string, @Body() dto: VoidSaleDto, @CurrentUser() user: any) {
    // Full refund reuses the same reversal logic as void for this scaffold;
    // extend with PARTIALLY_REFUNDED + per-item refund quantities as needed.
    return this.salesService.void(id, dto, user.id, user.role);
  }
}
