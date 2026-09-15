import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { EmptyBottlesService } from './empty-bottles.service';
import { RecordEmptyBottleDto } from './dto/empty-bottle.dto';

@Controller('empty-bottles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmptyBottlesController {
  constructor(private emptyBottlesService: EmptyBottlesService) {}

  @Get()
  getSummary() {
    return this.emptyBottlesService.getSummary();
  }

  @Get(':productId/history')
  getHistory(@Param('productId') productId: string) {
    return this.emptyBottlesService.getHistory(productId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'BARTENDER', 'CASHIER')
  record(@Body() dto: RecordEmptyBottleDto, @CurrentUser() user: any) {
    return this.emptyBottlesService.record(dto, user.id);
  }
}
