import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';

@Controller('units')
@UseGuards(JwtAuthGuard)
export class UnitsController {
  constructor(private unitsService: UnitsService) {}

  @Get()
  findAllForProduct(@Query('productId') productId: string) {
    return this.unitsService.findAllForProduct(productId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  create(@Body() dto: CreateUnitDto) {
    return this.unitsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.unitsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
