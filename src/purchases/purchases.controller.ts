import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/purchase.dto';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get()
  findAll(@Query('supplierId') supplierId?: string) {
    return this.purchasesService.findAll({ supplierId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  create(@Body() dto: CreatePurchaseDto, @CurrentUser() user: any) {
    return this.purchasesService.create(dto, user.id);
  }

  @Post(':id/pay')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  pay(@Param('id') id: string, @Body('amount') amount: number, @CurrentUser() user: any) {
    return this.purchasesService.pay(id, amount, user.id);
  }

  // Alias matching the design doc's /purchases/:id/receive - in this
  // implementation receiving IS creation (stock posts immediately on create),
  // so this simply returns the purchase for confirmation/printing.
  @Post(':id/receive')
  receive(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }
}
