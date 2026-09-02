import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto, DeactivateProductDto, DeleteProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.productsService.findAll({
      categoryId,
      search,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    });
  }

  @Get('barcode/:barcode')
  findByBarcode(@Param('barcode') barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  create(@Body() dto: CreateProductDto, @CurrentUser() user: any) {
    return this.productsService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: any) {
    return this.productsService.update(id, dto, user.id);
  }

  // Hide from POS/lists but keep every past record intact - available to
  // managers as well as admins, same as before.
  @Post(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  deactivate(@Param('id') id: string, @Body() dto: DeactivateProductDto, @CurrentUser() user: any) {
    return this.productsService.deactivate(id, dto, user.id);
  }

  @Post(':id/reactivate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  reactivate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.productsService.reactivate(id, user.id);
  }

  // Permanent delete - admin only, and only actually removes the row when
  // the product has no sales/purchase/stock history (see service for why).
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Body() dto: DeleteProductDto, @CurrentUser() user: any) {
    return this.productsService.remove(id, dto, user.id);
  }
}
