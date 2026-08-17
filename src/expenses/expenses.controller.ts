import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ExpensesService } from './expenses.service';
import { CreateExpenseCategoryDto, CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get('categories')
  findAllCategories() {
    return this.expensesService.findAllCategories();
  }

  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  createCategory(@Body() dto: CreateExpenseCategoryDto) {
    return this.expensesService.createCategory(dto);
  }

  @Get()
  findAll(@Query('categoryId') categoryId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.expensesService.findAll({ categoryId, from, to });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  create(@Body() dto: CreateExpenseDto, @CurrentUser() user: any) {
    return this.expensesService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto, @CurrentUser() user: any) {
    return this.expensesService.update(id, dto, user.id);
  }
}
