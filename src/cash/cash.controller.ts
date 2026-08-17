import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CashService } from './cash.service';
import { CloseSessionDto, CreateCashTransactionDto, OpenSessionDto } from './dto/cash.dto';

@Controller('cash')
@UseGuards(JwtAuthGuard)
export class CashController {
  constructor(private cashService: CashService) {}

  @Post('sessions/open')
  open(@Body() dto: OpenSessionDto, @CurrentUser() user: any) {
    return this.cashService.openSession(user.id, dto);
  }

  @Get('sessions/current')
  current(@CurrentUser() user: any) {
    return this.cashService.getCurrentSession(user.id);
  }

  @Post('sessions/:id/close')
  close(@Param('id') id: string, @Body() dto: CloseSessionDto, @CurrentUser() user: any) {
    return this.cashService.closeSession(id, dto, user.id);
  }

  @Get('sessions/:id/transactions')
  transactions(@Param('id') id: string) {
    return this.cashService.getTransactions(id);
  }

  @Post('sessions/:id/transactions')
  addTransaction(@Param('id') id: string, @Body() dto: CreateCashTransactionDto, @CurrentUser() user: any) {
    return this.cashService.recordTransaction(id, dto, user.id);
  }
}
