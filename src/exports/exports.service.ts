import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ReportsService } from '../reports/reports.service';

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFEFE6D0' },
};
const TITLE_FONT: Partial<ExcelJS.Font> = { name: 'Arial', bold: true, size: 14 };
const HEADER_FONT: Partial<ExcelJS.Font> = { name: 'Arial', bold: true, size: 10 };
const BODY_FONT: Partial<ExcelJS.Font> = { name: 'Arial', size: 10 };
const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
};
const MONEY_FORMAT = '#,##0';

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  money?: boolean;
  date?: boolean;
}

@Injectable()
export class ExportsService {
  constructor(private reportsService: ReportsService) {}

  /**
   * Generic single-table workbook: a title row, a header row, one row per
   * record, and an optional totals row. Every plain "list of records"
   * report (product sales, customer credit, supplier debt, capital
   * accounts, cash book, bills…) is built from this instead of hand-rolling
   * a worksheet each time, so "export to Excel" can cover every report
   * without a bespoke layout per tab.
   */
  private async buildTableWorkbook(
    title: string,
    columns: ExportColumn[],
    rows: Array<Record<string, any>>,
    options?: { subtitle?: string; totals?: Record<string, any> },
  ): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sochebar';
    workbook.created = new Date();
    const sheet = workbook.addWorksheet(title.slice(0, 31) || 'Report');

    sheet.columns = columns.map((c) => ({ width: c.width ?? 18 }));

    sheet.mergeCells(1, 1, 1, columns.length);
    const titleCell = sheet.getCell(1, 1);
    titleCell.value = options?.subtitle ? `${title} — ${options.subtitle}` : title;
    titleCell.font = TITLE_FONT;

    const headerRow = sheet.addRow(columns.map((c) => c.header));
    headerRow.eachCell((cell) => {
      cell.font = HEADER_FONT;
      cell.fill = HEADER_FILL;
      cell.border = THIN_BORDER;
    });

    for (const row of rows) {
      const excelRow = sheet.addRow(columns.map((c) => row[c.key] ?? null));
      excelRow.eachCell((cell, colNumber) => {
        cell.font = BODY_FONT;
        cell.border = THIN_BORDER;
        const col = columns[colNumber - 1];
        if (col.money) cell.numFmt = MONEY_FORMAT;
        if (col.date) cell.numFmt = 'dd/mm/yyyy';
      });
    }

    if (rows.length === 0) {
      sheet.addRow(['No data for this selection']).font = BODY_FONT;
    }

    if (options?.totals) {
      const totalsRow = sheet.addRow(columns.map((c) => options.totals![c.key] ?? null));
      totalsRow.eachCell((cell, colNumber) => {
        cell.font = HEADER_FONT;
        const col = columns[colNumber - 1];
        if (col.money) cell.numFmt = MONEY_FORMAT;
      });
    }

    return workbook.xlsx.writeBuffer();
  }

  /**
   * Rebuilds the exact layout of the bar's existing paper/Excel daily
   * sheet: ITEM/OPENING/PURCHASE/CLOSING/SALES/PRICE/TOTAL rows, a Grand
   * Total, a BILLS section by customer, and the cash summary (Cash,
   * Opening Cash, Bills Paid, expenses). Numbers come from the ledger
   * rather than being re-typed, so this is always reconcilable against the
   * system - not a parallel record that can drift from it.
   */
  async buildDailySheet(date: string): Promise<ExcelJS.Buffer> {
    const data = await this.reportsService.getDailySheet(date);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sochebar';
    workbook.created = new Date();

    const sheetName = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace('/', '-');
    const sheet = workbook.addWorksheet(sheetName || 'Daily Sheet');

    sheet.columns = [
      { width: 22 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 10 },
      { width: 12 },
      { width: 14 },
    ];

    // Title row
    sheet.mergeCells('A1:E1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'SOCHE BAR INVENTORY';
    titleCell.font = TITLE_FONT;
    sheet.getCell('F1').value = 'DATE';
    sheet.getCell('F1').font = HEADER_FONT;
    sheet.getCell('G1').value = new Date(date);
    sheet.getCell('G1').numFmt = 'dd/mm/yyyy';
    sheet.getCell('G1').font = BODY_FONT;

    // Column headers
    const headerRow = sheet.addRow(['ITEM', 'OPENING', 'PURCHASE', 'CLOSING', 'SALES', 'PRICE', 'TOTAL']);
    headerRow.eachCell((cell) => {
      cell.font = HEADER_FONT;
      cell.fill = HEADER_FILL;
      cell.border = THIN_BORDER;
    });

    for (const item of data.items) {
      const row = sheet.addRow([
        item.name,
        item.opening || null,
        item.purchase || null,
        item.closing,
        item.sales || null,
        item.price ?? null,
        item.total || null,
      ]);
      row.eachCell((cell, colNumber) => {
        cell.font = BODY_FONT;
        cell.border = THIN_BORDER;
        if (colNumber >= 6) cell.numFmt = MONEY_FORMAT;
      });
    }

    const grandTotalRow = sheet.addRow(['Grand Total', '', '', '', '', '', data.grandTotal]);
    grandTotalRow.font = HEADER_FONT;
    grandTotalRow.getCell(7).numFmt = MONEY_FORMAT;

    sheet.addRow([]);

    // Bills section
    const billsHeaderRow = sheet.addRow(['BILLS', 'CUSTOMER', '', '', 'AMOUNT', '', '']);
    billsHeaderRow.eachCell((cell) => {
      cell.font = HEADER_FONT;
      cell.fill = HEADER_FILL;
    });
    for (const bill of data.bills) {
      const row = sheet.addRow(['', bill.customerName, '', '', bill.amount, '', '']);
      row.getCell(5).numFmt = MONEY_FORMAT;
      row.font = BODY_FONT;
    }
    const billsTotalRow = sheet.addRow(['Total bills', '', '', '', data.billsTotal, '', '']);
    billsTotalRow.font = HEADER_FONT;
    billsTotalRow.getCell(5).numFmt = MONEY_FORMAT;

    sheet.addRow([]);

    // Cash summary
    const summaryRows: Array<[string, number]> = [
      ['Cash', data.cashCollected],
      ['Opening Cash', data.openingCash],
      ['Bills Paid', data.billsPaid],
      ['Zochoka (Expenses)', data.expenses],
    ];
    for (const [label, value] of summaryRows) {
      const row = sheet.addRow([label, value]);
      row.getCell(1).font = HEADER_FONT;
      row.getCell(2).font = BODY_FONT;
      row.getCell(2).numFmt = MONEY_FORMAT;
    }

    return workbook.xlsx.writeBuffer();
  }

  // ---------------- Bills (customer credit bills, by day) ----------------
  async buildBills(date: string): Promise<ExcelJS.Buffer> {
    const data = await this.reportsService.bills(date);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sochebar';
    workbook.created = new Date();
    const sheet = workbook.addWorksheet('Bills');

    sheet.columns = [{ width: 20 }, { width: 16 }, { width: 24 }, { width: 16 }, { width: 28 }];

    sheet.mergeCells('A1:E1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `Bills — ${date}`;
    titleCell.font = TITLE_FONT;

    const headerRow = sheet.addRow(['Time', 'Invoice #', 'Customer', 'Amount', 'Note']);
    headerRow.eachCell((cell) => {
      cell.font = HEADER_FONT;
      cell.fill = HEADER_FILL;
      cell.border = THIN_BORDER;
    });

    for (const bill of data.bills) {
      const row = sheet.addRow([
        new Date(bill.recordedAt).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        bill.invoiceNumber,
        bill.customerName,
        bill.amount,
        bill.comment ?? '',
      ]);
      row.eachCell((cell, colNumber) => {
        cell.font = BODY_FONT;
        cell.border = THIN_BORDER;
        if (colNumber === 4) cell.numFmt = MONEY_FORMAT;
      });
    }
    if (data.bills.length === 0) {
      sheet.addRow(['No bills recorded on this day']).font = BODY_FONT;
    }

    const dayTotalRow = sheet.addRow(['', '', `Total for ${date}`, data.dayTotal, '']);
    dayTotalRow.font = HEADER_FONT;
    dayTotalRow.getCell(4).numFmt = MONEY_FORMAT;

    // Running total of every bill ever recorded through the end of this
    // day, so the sheet answers both "what came in today" and "the total
    // run up to today" without a second export.
    const cumulativeRow = sheet.addRow(['', '', `All bills to date (through ${date})`, data.cumulativeTotal, '']);
    cumulativeRow.font = HEADER_FONT;
    cumulativeRow.getCell(4).numFmt = MONEY_FORMAT;

    return workbook.xlsx.writeBuffer();
  }

  // ---------------- Product sales ----------------
  async buildProductSales(from?: string, to?: string): Promise<ExcelJS.Buffer> {
    const rows = await this.reportsService.productSales(from, to);
    const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
    const totalProfit = rows.reduce((s, r) => s + r.grossProfit, 0);
    return this.buildTableWorkbook(
      'Product Sales',
      [
        { header: 'Product', key: 'name', width: 26 },
        { header: 'Qty sold', key: 'qty', width: 12 },
        { header: 'Revenue', key: 'revenue', width: 16, money: true },
        { header: 'Cost', key: 'cost', width: 16, money: true },
        { header: 'Gross profit', key: 'grossProfit', width: 16, money: true },
        { header: 'Margin %', key: 'marginPercent', width: 12 },
      ],
      rows,
      {
        subtitle: [from, to].filter(Boolean).join(' to '),
        totals: { name: 'Total', revenue: totalRevenue, grossProfit: totalProfit },
      },
    );
  }

  // ---------------- Customer credit (all or selected customers) ----------------
  async buildCustomerCredit(customerIds?: string[]): Promise<ExcelJS.Buffer> {
    const rows = await this.reportsService.customerCredit(customerIds);
    const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0);
    return this.buildTableWorkbook(
      'Customer Credit',
      [
        { header: 'Customer', key: 'customer', width: 26 },
        { header: 'Phone', key: 'phone', width: 16 },
        { header: 'Bills (credit sales)', key: 'creditSales', width: 18, money: true },
        { header: 'Payments', key: 'payments', width: 16, money: true },
        { header: 'Outstanding', key: 'outstanding', width: 16, money: true },
      ],
      rows,
      {
        subtitle: customerIds?.length ? `${rows.length} selected customer(s)` : 'All customers',
        totals: { customer: 'Total', outstanding: totalOutstanding },
      },
    );
  }

  // ---------------- Supplier debt ----------------
  async buildSupplierDebt(): Promise<ExcelJS.Buffer> {
    const rows = await this.reportsService.supplierDebt();
    const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0);
    return this.buildTableWorkbook(
      'Supplier Debt',
      [
        { header: 'Supplier', key: 'supplier', width: 26 },
        { header: 'Purchases', key: 'purchases', width: 16, money: true },
        { header: 'Payments', key: 'payments', width: 16, money: true },
        { header: 'Outstanding', key: 'outstanding', width: 16, money: true },
      ],
      rows,
      { totals: { supplier: 'Total', outstanding: totalOutstanding } },
    );
  }

  // ---------------- Capital accounts ----------------
  async buildCapitalAccounts(): Promise<ExcelJS.Buffer> {
    const rows = await this.reportsService.capitalAccountsSummary();
    const totalBalance = rows.reduce((s, r) => s + r.balance, 0);
    return this.buildTableWorkbook(
      'Capital Accounts',
      [
        { header: 'Partner', key: 'partner', width: 24 },
        { header: 'Contributions', key: 'contributions', width: 18, money: true },
        { header: 'Drawings', key: 'drawings', width: 16, money: true },
        { header: 'Balance', key: 'balance', width: 16, money: true },
      ],
      rows,
      { totals: { partner: 'Total', balance: totalBalance } },
    );
  }

  // ---------------- Cash book ----------------
  async buildCashBook(from?: string, to?: string): Promise<ExcelJS.Buffer> {
    const rows = await this.reportsService.cashBook(from, to);
    const totalClosing = rows.reduce((s, r) => s + r.closingBalance, 0);
    return this.buildTableWorkbook(
      'Cash Book',
      [
        { header: 'Account', key: 'account', width: 22 },
        { header: 'Type', key: 'type', width: 14 },
        { header: 'Opening', key: 'openingBalance', width: 16, money: true },
        { header: 'In', key: 'totalIn', width: 16, money: true },
        { header: 'Out', key: 'totalOut', width: 16, money: true },
        { header: 'Closing', key: 'closingBalance', width: 16, money: true },
      ],
      rows,
      { subtitle: [from, to].filter(Boolean).join(' to '), totals: { account: 'Total', closingBalance: totalClosing } },
    );
  }

  // ---------------- Daily sales summary ----------------
  async buildDailySales(date: string): Promise<ExcelJS.Buffer> {
    const data = await this.reportsService.dailySales(date);
    const rows = [
      { label: 'Total sales', value: data.totalSales },
      { label: 'Discounts', value: data.discounts },
      { label: 'Refunds', value: data.refunds },
      { label: 'Cash', value: data.payments.cash },
      { label: 'Airtel Money', value: data.payments.airtelMoney },
      { label: 'Mpamba', value: data.payments.mpamba },
      { label: 'Bank', value: data.payments.bank },
      { label: 'Credit', value: data.payments.credit },
      { label: 'Other', value: data.payments.other },
    ];
    return this.buildTableWorkbook(
      'Daily Sales',
      [
        { header: 'Line', key: 'label', width: 24 },
        { header: 'Amount', key: 'value', width: 18, money: true },
      ],
      rows,
      { subtitle: date },
    );
  }

  // ---------------- Profit ----------------
  async buildProfit(from?: string, to?: string): Promise<ExcelJS.Buffer> {
    const data = await this.reportsService.profit(from, to);
    const rows = [
      { label: 'Revenue', value: data.revenue },
      { label: 'Cost of goods sold', value: -data.cogs },
      { label: 'Gross profit', value: data.grossProfit },
      { label: 'Operating expenses', value: -data.operatingExpenses },
      { label: 'Net profit', value: data.netProfit },
    ];
    return this.buildTableWorkbook(
      'Profit',
      [
        { header: 'Line', key: 'label', width: 24 },
        { header: 'Amount', key: 'value', width: 18, money: true },
      ],
      rows,
      { subtitle: [from, to].filter(Boolean).join(' to ') },
    );
  }

  // ---------------- P&L statement ----------------
  async buildPlStatement(from?: string, to?: string): Promise<ExcelJS.Buffer> {
    const data = await this.reportsService.plStatement(from, to);
    const rows = [
      { label: 'Sales', value: data.sales },
      { label: 'Opening stock', value: data.costOfSales.opening },
      { label: '+ Purchases', value: data.costOfSales.purchases },
      { label: '− Closing stock', value: -data.costOfSales.closing },
      { label: 'Cost of sales', value: data.costOfSales.total },
      { label: 'Gross profit', value: data.grossProfit },
      ...data.expenses.map((e) => ({ label: `Expense: ${e.category}`, value: e.amount })),
      { label: 'Total expenses', value: data.totalExpenses },
      { label: 'Net profit', value: data.netProfit },
    ];
    return this.buildTableWorkbook(
      'P&L Statement',
      [
        { header: 'Line', key: 'label', width: 28 },
        { header: 'Amount', key: 'value', width: 18, money: true },
      ],
      rows,
      { subtitle: [from, to].filter(Boolean).join(' to ') },
    );
  }

  // ---------------- Balance sheet ----------------
  async buildBalanceSheet(asOfDate?: string): Promise<ExcelJS.Buffer> {
    const data = await this.reportsService.balanceSheet(asOfDate);
    const rows = [
      { label: 'Non-current assets', value: data.nonCurrentAssets.total },
      { label: 'Stock', value: data.currentAssets.stock },
      { label: 'Cash', value: data.currentAssets.cash.total },
      { label: 'Customer receivables', value: data.currentAssets.receivables },
      { label: 'Total current assets', value: data.currentAssets.total },
      { label: 'Total assets', value: data.totalAssets },
      { label: 'Total liabilities', value: data.liabilities.total },
      { label: 'Total capital', value: data.equity.totalCapital },
      { label: 'Retained earnings', value: data.equity.retainedEarnings },
      { label: 'Total equity', value: data.equity.total },
      { label: 'Total liabilities & equity', value: data.totalLiabilitiesAndEquity },
    ];
    return this.buildTableWorkbook(
      'Balance Sheet',
      [
        { header: 'Line', key: 'label', width: 28 },
        { header: 'Amount', key: 'value', width: 18, money: true },
      ],
      rows,
      { subtitle: asOfDate ?? 'Current' },
    );
  }
}
