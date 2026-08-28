import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccountsService } from './accounts.service';
import {
  CreateCapitalTransactionDto,
  CreateCashAccountDto,
  CreateCashAccountTransactionDto,
  CreateFixedAssetDto,
  CreatePartnerDto,
  TransferCashDto,
} from './dto/accounts.dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  // ---- Partners / capital accounts ----
  @Get('partners')
  findAllPartners() {
    return this.accountsService.findAllPartners();
  }

  @Post('partners')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  createPartner(@Body() dto: CreatePartnerDto) {
    return this.accountsService.createPartner(dto);
  }

  @Get('capital-transactions')
  findCapitalTransactions(@Query('partnerId') partnerId?: string) {
    return this.accountsService.findCapitalTransactions(partnerId);
  }

  @Post('capital-transactions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  createCapitalTransaction(@Body() dto: CreateCapitalTransactionDto, @CurrentUser() user: any) {
    return this.accountsService.createCapitalTransaction(dto, user.id);
  }

  // ---- Fixed assets ----
  @Get('fixed-assets')
  findAllFixedAssets() {
    return this.accountsService.findAllFixedAssets();
  }

  @Post('fixed-assets')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  createFixedAsset(@Body() dto: CreateFixedAssetDto, @CurrentUser() user: any) {
    return this.accountsService.createFixedAsset(dto, user.id);
  }

  // ---- Cash accounts (Bank / Mobile Money / Petty Cash) ----
  @Get('cash-accounts')
  findAllCashAccounts() {
    return this.accountsService.findAllCashAccounts();
  }

  @Post('cash-accounts')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  createCashAccount(@Body() dto: CreateCashAccountDto) {
    return this.accountsService.createCashAccount(dto);
  }

  @Get('cash-accounts/:id/balance')
  cashAccountBalance(@Param('id') id: string) {
    return this.accountsService.cashAccountBalance(id);
  }

  @Get('cash-account-transactions')
  findCashAccountTransactions(
    @Query('cashAccountId') cashAccountId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.accountsService.findCashAccountTransactions(cashAccountId, from, to);
  }

  @Post('cash-account-transactions')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  createCashAccountTransaction(@Body() dto: CreateCashAccountTransactionDto, @CurrentUser() user: any) {
    return this.accountsService.createCashAccountTransaction(dto, user.id);
  }

  @Post('cash-transfers')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  transferCash(@Body() dto: TransferCashDto, @CurrentUser() user: any) {
    return this.accountsService.transferCash(dto, user.id);
  }
}
