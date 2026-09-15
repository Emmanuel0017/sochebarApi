import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InventoryService } from './inventory.service';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { WastageService } from './wastage.service';
import { CreateStockAdjustmentDto, CreateWastageDto } from './dto/inventory.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private stockAdjustmentsService: StockAdjustmentsService,
    private wastageService: WastageService,
  ) {}

  @Get()
  getStockSummary() {
    return this.inventoryService.getStockSummary();
  }

  @Get(':productId')
  async getCurrentStock(@Param('productId') productId: string) {
    const stock = await this.inventoryService.getCurrentStock(productId);
    return { productId, stock };
  }

  @Get(':productId/history')
  getHistory(@Param('productId') productId: string) {
    return this.inventoryService.getHistory(productId);
  }

  @Post('adjustments')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  createAdjustment(@Body() dto: CreateStockAdjustmentDto, @CurrentUser() user: any) {
    return this.stockAdjustmentsService.create(dto, user.id, user.role);
  }

  @Get('adjustments/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  findAllAdjustments() {
    return this.stockAdjustmentsService.findAll();
  }

  @Patch('adjustments/:id/approve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  approveAdjustment(@Param('id') id: string, @CurrentUser() user: any) {
    return this.stockAdjustmentsService.approve(id, user.id);
  }

  @Post('wastage')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'BARTENDER')
  createWastage(@Body() dto: CreateWastageDto, @CurrentUser() user: any) {
    return this.wastageService.create(dto, user.id);
  }

  @Get('wastage/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  findAllWastage() {
    return this.wastageService.findAll();
  }

  @Patch('wastage/:id/approve')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  approveWastage(@Param('id') id: string, @CurrentUser() user: any) {
    return this.wastageService.approve(id, user.id);
  }
}
