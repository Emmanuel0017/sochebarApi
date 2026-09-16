import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type * as ExcelJS from 'exceljs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ExportsService } from './exports.service';

// No @Roles() here on purpose — see DashboardController for the reasoning.
// Every route below is a GET that streams a file; VIEWER needs this
// specifically (owner asked to "view everything ... and export files").
@Controller('exports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportsController {
  constructor(private exportsService: ExportsService) {}

  private static readonly XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  private send(res: Response, buffer: ExcelJS.Buffer, filename: string) {
    res.setHeader('Content-Type', ExportsController.XLSX_TYPE);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  @Get('daily-sheet')
  async dailySheet(@Query('date') date: string | undefined, @Res() res: Response) {
    const targetDate = date ?? new Date().toISOString().slice(0, 10);
    const buffer = await this.exportsService.buildDailySheet(targetDate);
    this.send(res, buffer, `Soche_Bar_Inventory_${targetDate}.xlsx`);
  }

  @Get('bills')
  async bills(@Query('date') date: string | undefined, @Res() res: Response) {
    const targetDate = date ?? new Date().toISOString().slice(0, 10);
    const buffer = await this.exportsService.buildBills(targetDate);
    this.send(res, buffer, `Sochebar_Bills_${targetDate}.xlsx`);
  }

  @Get('daily-sales')
  async dailySales(@Query('date') date: string | undefined, @Res() res: Response) {
    const targetDate = date ?? new Date().toISOString().slice(0, 10);
    const buffer = await this.exportsService.buildDailySales(targetDate);
    this.send(res, buffer, `Sochebar_Daily_Sales_${targetDate}.xlsx`);
  }

  @Get('product-sales')
  async productSales(@Query('from') from: string | undefined, @Query('to') to: string | undefined, @Res() res: Response) {
    const buffer = await this.exportsService.buildProductSales(from, to);
    this.send(res, buffer, `Sochebar_Product_Sales_${from ?? 'all'}_${to ?? 'all'}.xlsx`);
  }

  @Get('customer-credit')
  async customerCredit(@Query('customerIds') customerIds: string | undefined, @Res() res: Response) {
    const ids = customerIds ? customerIds.split(',').filter(Boolean) : undefined;
    const buffer = await this.exportsService.buildCustomerCredit(ids);
    const suffix = ids?.length ? `Selected_${ids.length}` : 'All';
    this.send(res, buffer, `Sochebar_Customer_Credit_${suffix}.xlsx`);
  }

  @Get('supplier-credit')
  async supplierCredit(@Res() res: Response) {
    const buffer = await this.exportsService.buildSupplierDebt();
    this.send(res, buffer, `Sochebar_Supplier_Debt.xlsx`);
  }

  @Get('profit')
  async profit(@Query('from') from: string | undefined, @Query('to') to: string | undefined, @Res() res: Response) {
    const buffer = await this.exportsService.buildProfit(from, to);
    this.send(res, buffer, `Sochebar_Profit_${from ?? 'all'}_${to ?? 'all'}.xlsx`);
  }

  @Get('pl-statement')
  async plStatement(@Query('from') from: string | undefined, @Query('to') to: string | undefined, @Res() res: Response) {
    const buffer = await this.exportsService.buildPlStatement(from, to);
    this.send(res, buffer, `Sochebar_PL_Statement_${from ?? 'all'}_${to ?? 'all'}.xlsx`);
  }

  @Get('balance-sheet')
  async balanceSheet(@Query('asOfDate') asOfDate: string | undefined, @Res() res: Response) {
    const buffer = await this.exportsService.buildBalanceSheet(asOfDate);
    this.send(res, buffer, `Sochebar_Balance_Sheet_${asOfDate ?? 'current'}.xlsx`);
  }

  @Get('capital-accounts')
  async capitalAccounts(@Res() res: Response) {
    const buffer = await this.exportsService.buildCapitalAccounts();
    this.send(res, buffer, `Sochebar_Capital_Accounts.xlsx`);
  }

  @Get('cash-book')
  async cashBook(@Query('from') from: string | undefined, @Query('to') to: string | undefined, @Res() res: Response) {
    const buffer = await this.exportsService.buildCashBook(from, to);
    this.send(res, buffer, `Sochebar_Cash_Book_${from ?? 'all'}_${to ?? 'all'}.xlsx`);
  }
}