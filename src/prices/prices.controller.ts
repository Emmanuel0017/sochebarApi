import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PricesService } from './prices.service';
import { CreatePriceDto, UpdatePriceDto } from './dto/price.dto';

@Controller('products/:productId/prices')
@UseGuards(JwtAuthGuard)
export class PricesController {
  constructor(private pricesService: PricesService) {}

  @Get()
  findAllForProduct(@Param('productId') productId: string) {
    return this.pricesService.findAllForProduct(productId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  create(@Param('productId') productId: string, @Body() dto: CreatePriceDto, @CurrentUser() user: any) {
    return this.pricesService.create(productId, dto, user.id);
  }
}

@Controller('prices')
@UseGuards(JwtAuthGuard)
export class PricesUpdateController {
  constructor(private pricesService: PricesService) {}

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  update(@Param('id') id: string, @Body() dto: UpdatePriceDto) {
    return this.pricesService.update(id, dto);
  }
}
