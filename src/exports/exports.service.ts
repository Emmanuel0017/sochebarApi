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

@Injectable()
export class ExportsService {
  constructor(private reportsService: ReportsService) {}

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
}
