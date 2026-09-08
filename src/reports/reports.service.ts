import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { localDayBounds, localEndOfDay, localStartOfDay } from '../common/date-range.util';

// Anchored to Africa/Blantyre (UTC+2), not raw UTC - see date-range.util.ts.
// `to` is inclusive of the whole day (previously it landed on that day's
// midnight, silently cutting the last day out of every range report).
function dateRange(from?: string, to?: string) {
  return {
    gte: from ? localStartOfDay(from) : undefined,
    lte: to ? localEndOfDay(to) : undefined,
  };
}

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // ---------------- Daily sales report ----------------
  async dailySales(date: string) {
    const { gte: start, lte: end } = localDayBounds(date);

    const sales = await this.prisma.sale.findMany({
      where: { 
        saleDate: { gte: start, lte: end }, 
        status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] } 
      },
      include: { payments: true },
    });

    const totalSales = sales.reduce((s, sale) => s + Number(sale.total), 0);
    const discounts = sales.reduce((s, sale) => s + Number(sale.discount), 0);

    const byMethod: Record<string, number> = {};
    for (const sale of sales) {
      for (const p of sale.payments) {
        byMethod[p.paymentMethod] = (byMethod[p.paymentMethod] ?? 0) + Number(p.amount);
      }
    }

    const refunds = await this.prisma.sale.aggregate({
      where: { 
        saleDate: { gte: start, lte: end }, 
        status: { in: ['REFUNDED', 'PARTIALLY_REFUNDED', 'VOIDED'] } 
      },
      _sum: { total: true },
    });

    return {
      date,
      totalSales,
      discounts,
      refunds: Number(refunds._sum.total ?? 0),
      payments: {
        cash: byMethod.CASH ?? 0,
        airtelMoney: byMethod.AIRTEL_MONEY ?? 0,
        mpamba: byMethod.MPAMBA ?? 0,
        bank: byMethod.BANK ?? 0,
        credit: byMethod.CREDIT ?? 0,
        other: byMethod.OTHER ?? 0,
      },
    };
  }

  // ---------------- Product sales report ----------------
  async productSales(from?: string, to?: string) {
    const range = dateRange(from, to);
    const items = await this.prisma.saleItem.findMany({
      where: { 
        sale: { 
          status: 'COMPLETED', 
          saleDate: range 
        } 
      },
      include: { product: true },
    });

    const map = new Map<string, { productId: string; name: string; qty: number; revenue: number }>();
    for (const item of items) {
      const key = item.productId;
      const entry = map.get(key) ?? { 
        productId: key, 
        name: item.product.name, 
        qty: 0, 
        revenue: 0 
      };
      entry.qty += Number(item.quantity);
      entry.revenue += Number(item.total);
      map.set(key, entry);
    }

    const results: Array<{
      productId: string;
      name: string;
      qty: number;
      revenue: number;
      cost: number;
      grossProfit: number;
      marginPercent: number;
    }> = [];
    
    for (const entry of map.values()) {
      const lastPurchase = await this.prisma.purchaseItem.findFirst({
        where: { productId: entry.productId },
        orderBy: { id: 'desc' },
      });
      const unitCost = lastPurchase ? Number(lastPurchase.unitCost) : 0;
      const cost = unitCost * entry.qty;
      const grossProfit = entry.revenue - cost;
      const margin = entry.revenue > 0 ? (grossProfit / entry.revenue) * 100 : 0;
      results.push({ 
        ...entry, 
        cost, 
        grossProfit, 
        marginPercent: Number(margin.toFixed(2)) 
      });
    }

    return results.sort((a, b) => b.revenue - a.revenue);
  }

  // ---------------- Inventory report ----------------
  async inventory(productId?: string) {
    const products = await this.prisma.product.findMany({
      where: { id: productId, trackInventory: true },
      include: { units: { where: { isBaseUnit: true } } },
    });

    const results: Array<{
      productId: string;
      name: string;
      baseUnit: string;
      purchases: number;
      sales: number;
      wastage: number;
      adjustments: number;
      expectedStock: number;
    }> = [];
    
    for (const p of products) {
      const agg = await this.prisma.inventoryTransaction.groupBy({
        by: ['transactionType'],
        where: { productId: p.id },
        _sum: { quantity: true },
      });

      const sum = (t: string) => Number(agg.find((a) => a.transactionType === t)?._sum.quantity ?? 0);
      const purchases = sum('PURCHASE');
      const sales = Math.abs(sum('SALE'));
      const wastage = Math.abs(sum('WASTAGE'));
      const adjustments = sum('ADJUSTMENT');
      const returns = sum('RETURN');
      const expectedStock = purchases + sales * -1 + wastage * -1 + adjustments + returns;

      results.push({
        productId: p.id,
        name: p.name,
        baseUnit: p.units[0]?.name ?? 'unit',
        purchases,
        sales,
        wastage,
        adjustments,
        expectedStock,
      });
    }
    return results;
  }

  // ---------------- Purchase report ----------------
  async purchases(from?: string, to?: string) {
    const range = dateRange(from, to);
    const purchases = await this.prisma.purchase.findMany({
      where: { purchaseDate: range },
      include: { supplier: true },
    });

    const map = new Map<string, { supplierId: string | null; name: string; count: number; total: number; paid: number }>();
    for (const p of purchases) {
      const key = p.supplierId ?? 'NO_SUPPLIER';
      const entry = map.get(key) ?? {
        supplierId: p.supplierId,
        name: p.supplier?.name ?? 'No supplier',
        count: 0,
        total: 0,
        paid: 0,
      };
      entry.count += 1;
      entry.total += Number(p.total);
      entry.paid += Number(p.amountPaid);
      map.set(key, entry);
    }

    return Array.from(map.values()).map((e) => ({ ...e, outstanding: e.total - e.paid }));
  }

  // ---------------- Expense report ----------------
  async expenses(from?: string, to?: string) {
    const range = dateRange(from, to);
    const grouped = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { expenseDate: range },
      _sum: { amount: true },
    });

    const categories = await this.prisma.expenseCategory.findMany();
    return grouped.map((g) => ({
      category: categories.find((c) => c.id === g.categoryId)?.name ?? 'Unknown',
      totalAmount: Number(g._sum.amount ?? 0),
    }));
  }

  // ---------------- Cash report ----------------
  async cash(sessionId: string) {
    const session = await this.prisma.cashSession.findUniqueOrThrow({ where: { id: sessionId } });
    const txns = await this.prisma.cashTransaction.groupBy({
      by: ['transactionType'],
      where: { cashSessionId: sessionId },
      _sum: { amount: true },
    });
    const sum = (t: string) => Number(txns.find((x) => x.transactionType === t)?._sum.amount ?? 0);

    return {
      openingCash: Number(session.openingCash),
      cashSales: sum('SALE'),
      cashExpenses: sum('EXPENSE'),
      withdrawals: sum('WITHDRAWAL'),
      deposits: sum('DEPOSIT'),
      expectedCash: session.expectedCash ? Number(session.expectedCash) : null,
      actualCash: session.actualCash ? Number(session.actualCash) : null,
      difference: session.difference ? Number(session.difference) : null,
    };
  }

  // ---------------- Credit report (customers) ----------------
  // With no customerIds given, returns every customer who has ever had
  // credit activity (the usual "who owes what" report). When customerIds
  // IS given (a manager picking specific customers to export), every named
  // customer is returned regardless of balance, since that's an explicit
  // selection rather than a "who's outstanding" filter.
  async customerCredit(customerIds?: string[]) {
    const customers = await this.prisma.customer.findMany({
      where: customerIds?.length ? { id: { in: customerIds } } : undefined,
    });
    const results: Array<{
      customerId: string;
      customer: string;
      phone: string | null;
      creditSales: number;
      payments: number;
      outstanding: number;
    }> = [];
    for (const c of customers) {
      const agg = await this.prisma.customerTransaction.groupBy({
        by: ['transactionType'],
        where: { customerId: c.id },
        _sum: { amount: true },
      });
      const sum = (t: string) => Number(agg.find((a) => a.transactionType === t)?._sum.amount ?? 0);
      const creditSales = sum('CREDIT_SALE');
      const payments = sum('PAYMENT');
      const adjustments = sum('ADJUSTMENT');
      results.push({
        customerId: c.id,
        customer: c.name,
        phone: c.phone,
        creditSales,
        payments,
        outstanding: creditSales - payments + adjustments,
      });
    }
    if (customerIds?.length) return results;
    return results.filter((r) => r.creditSales !== 0 || r.outstanding !== 0);
  }

  // ---------------- Bills report (customer credit bills, by day) ----------------
  // "Bills" = credit sales (Sale rows carrying a CREDIT payment line),
  // consistent with how the daily sheet already defines a bill. Given a
  // date, returns that day's individual bills plus two totals: the day's
  // own sum, and a running cumulative sum of every bill ever recorded from
  // the beginning up to and including that day - so a manager can see both
  // "what came in today" and "the total tab run up to today" at a glance.
  async bills(date: string) {
    const { gte: dayStart, lte: dayEnd } = localDayBounds(date);

    const daySales = await this.prisma.sale.findMany({
      where: {
        saleDate: { gte: dayStart, lte: dayEnd },
        status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] },
        payments: { some: { paymentMethod: 'CREDIT' } },
      },
      include: { payments: { where: { paymentMethod: 'CREDIT' } }, customer: true },
      orderBy: { saleDate: 'asc' },
    });

    const bills = daySales.flatMap((s) =>
      s.payments.map((p) => ({
        id: p.id,
        saleId: s.id,
        invoiceNumber: s.invoiceNumber,
        customerId: s.customer?.id ?? p.customerId ?? null,
        customerName: s.customer?.name ?? 'Unknown',
        amount: Number(p.amount),
        comment: p.comment ?? null,
        recordedAt: s.saleDate,
      })),
    );

    const dayTotal = bills.reduce((s, b) => s + b.amount, 0);

    // Cumulative = every credit-sale bill from the beginning of records
    // through the end of the selected day, regardless of whether it's been
    // paid off since - a running total of bills raised, not outstanding.
    const cumulativeAgg = await this.prisma.customerTransaction.aggregate({
      where: { transactionType: 'CREDIT_SALE', createdAt: { lte: dayEnd } },
      _sum: { amount: true },
    });
    const cumulativeTotal = Number(cumulativeAgg._sum.amount ?? 0);

    return { date, bills, dayTotal, cumulativeTotal };
  }

  // ---------------- Supplier debt report ----------------
  async supplierDebt() {
    const suppliers = await this.prisma.supplier.findMany();
    const results: Array<{ supplier: string; purchases: number; payments: number; outstanding: number }> = [];
    for (const s of suppliers) {
      const agg = await this.prisma.supplierTransaction.groupBy({
        by: ['transactionType'],
        where: { supplierId: s.id },
        _sum: { amount: true },
      });
      const sum = (t: string) => Number(agg.find((a) => a.transactionType === t)?._sum.amount ?? 0);
      const purchases = sum('PURCHASE');
      const payments = sum('PAYMENT');
      results.push({ supplier: s.name, purchases, payments, outstanding: purchases - payments });
    }
    return results.filter((r) => r.purchases !== 0 || r.outstanding !== 0);
  }

  // ---------------- Daily reconciliation sheet ----------------
  async getDailySheet(date: string) {
    // Business day is anchored to Africa/Blantyre (UTC+2), not the server's clock -
    // see date-range.util.ts. This matters here specifically because purchases/sales
    // near midnight would otherwise be silently dropped from the day's window.
    const { gte: dayStart, lte: dayEnd } = localDayBounds(date);

    // Get all products
    const products = await this.prisma.product.findMany({
      where: { isActive: true, trackInventory: true },
      include: { 
        units: { where: { isBaseUnit: true } },
        prices: { where: { priceType: 'NORMAL', effectiveTo: null } }
      },
      orderBy: { name: 'asc' },
    });

    const items: Array<{
      name: string;
      baseUnit: string;
      opening: number;
      purchase: number;
      closing: number;
      sales: number;
      price: number | null;
      total: number;
    }> = [];

    for (const p of products) {
      const baseUnit = p.units[0];
      if (!baseUnit) continue;

      // Opening stock - before the day starts
      const openingAgg = await this.prisma.inventoryTransaction.aggregate({
        where: { 
          productId: p.id, 
          createdAt: { lt: dayStart } 
        },
        _sum: { quantity: true },
      });
      const opening = Number(openingAgg._sum.quantity ?? 0);

      // Day's transactions
      const dayAgg = await this.prisma.inventoryTransaction.groupBy({
        by: ['transactionType'],
        where: { 
          productId: p.id, 
          createdAt: { gte: dayStart, lte: dayEnd } 
        },
        _sum: { quantity: true },
      });

      const sum = (t: string) => Number(dayAgg.find((a) => a.transactionType === t)?._sum.quantity ?? 0);

      const purchase = sum('PURCHASE');
      const returns = sum('RETURN');
      const sales = Math.abs(sum('SALE'));
      const wastage = Math.abs(sum('WASTAGE')) + Math.abs(sum('DAMAGE'));
      const adjustments = sum('ADJUSTMENT');
      const closing = opening + purchase + returns - sales - wastage + adjustments;

      // Get sales from sale items for this day
      const salesItems = await this.prisma.saleItem.findMany({
        where: {
          productId: p.id,
          sale: {
            saleDate: { gte: dayStart, lte: dayEnd },
            status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] }
          }
        }
      });

      const totalSalesQty = salesItems.reduce((sum, item) => sum + Number(item.quantity), 0);
      // Actual revenue for the day - sums what each sale line was really
      // charged at, not quantity x today's price (which drifts from the
      // true total any time prices have changed since).
      const totalSalesRevenue = salesItems.reduce((sum, item) => sum + Number(item.total), 0);
      const price = p.prices.find((pr) => pr.unitId === baseUnit.id);

      items.push({
        name: p.name,
        baseUnit: baseUnit.name,
        opening,
        purchase,
        closing,
        sales: totalSalesQty || sales, // Use sales from sale items if available
        price: price ? Number(price.price) : null,
        total: totalSalesRevenue,
      });
    }

    // Filter items with activity for the selected date
    const filteredItems = items.filter(i => 
      i.opening !== 0 || 
      i.purchase !== 0 || 
      i.sales !== 0 || 
      i.closing !== 0 ||
      i.total !== 0
    );

    const grandTotal = filteredItems.reduce((s, i) => s + i.total, 0);

    // Bills: credit sales for the day
    const creditSales = await this.prisma.sale.findMany({
      where: {
        saleDate: { gte: dayStart, lte: dayEnd },
        status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] },
        payments: { some: { paymentMethod: 'CREDIT' } },
      },
      include: { payments: true, customer: true },
    });

    const bills = creditSales.map((s) => ({
      customerName: s.customer?.name ?? 'Unknown',
      amount: s.payments
        .filter((p) => p.paymentMethod === 'CREDIT')
        .reduce((sum, p) => sum + Number(p.amount), 0),
    }));
    const billsTotal = bills.reduce((s, b) => s + b.amount, 0);

    // Cash summary
    const cashAgg = await this.prisma.payment.aggregate({
      where: { 
        paymentMethod: 'CASH', 
        sale: { saleDate: { gte: dayStart, lte: dayEnd } } 
      },
      _sum: { amount: true },
    });
    const cashCollected = Number(cashAgg._sum.amount ?? 0);

    const sessionsAgg = await this.prisma.cashSession.aggregate({
      where: { openedAt: { gte: dayStart, lte: dayEnd } },
      _sum: { openingCash: true },
    });
    const openingCash = Number(sessionsAgg._sum.openingCash ?? 0);

    const billsPaidAgg = await this.prisma.customerTransaction.aggregate({
      where: { 
        transactionType: 'PAYMENT', 
        createdAt: { gte: dayStart, lte: dayEnd } 
      },
      _sum: { amount: true },
    });
    const billsPaid = Number(billsPaidAgg._sum.amount ?? 0);

    const expensesAgg = await this.prisma.expense.aggregate({
      where: { expenseDate: { gte: dayStart, lte: dayEnd } },
      _sum: { amount: true },
    });
    const expenses = Number(expensesAgg._sum.amount ?? 0);

    return {
      date,
      items: filteredItems,
      grandTotal,
      bills,
      billsTotal,
      cashCollected,
      openingCash,
      billsPaid,
      expenses,
    };
  }

  // ---------------- Profit report ----------------
  async profit(from?: string, to?: string) {
    const productSales = await this.productSales(from, to);
    const revenue = productSales.reduce((s, p) => s + p.revenue, 0);
    const cogs = productSales.reduce((s, p) => s + p.cost, 0);
    const grossProfit = revenue - cogs;

    const expenseAgg = await this.prisma.expense.aggregate({
      where: { expenseDate: dateRange(from, to) },
      _sum: { amount: true },
    });
    const operatingExpenses = Number(expenseAgg._sum.amount ?? 0);
    const netProfit = grossProfit - operatingExpenses;

    return { revenue, cogs, grossProfit, operatingExpenses, netProfit };
  }

  // ---------------- Stock valuation (helper) ----------------
  private async stockValue(asOf?: Date) {
    const products = await this.prisma.product.findMany({ where: { trackInventory: true } });

    let totalQty = 0;
    let totalValue = 0;
    for (const p of products) {
      const agg = await this.prisma.inventoryTransaction.aggregate({
        where: { 
          productId: p.id, 
          ...(asOf ? { createdAt: { lte: asOf } } : {}) 
        },
        _sum: { quantity: true },
      });
      const qty = Number(agg._sum.quantity ?? 0);
      if (qty === 0) continue;

      const lastPurchase = await this.prisma.purchaseItem.findFirst({
        where: {
          productId: p.id,
          ...(asOf ? { purchase: { purchaseDate: { lte: asOf } } } : {}),
        },
        orderBy: { id: 'desc' },
      });
      const unitCost = lastPurchase ? Number(lastPurchase.unitCost) : 0;

      totalQty += qty;
      totalValue += qty * unitCost;
    }
    return { totalQty, totalValue };
  }

  // ---------------- P&L Statement ----------------
  async plStatement(from?: string, to?: string) {
    const range = dateRange(from, to);

    const salesAgg = await this.prisma.sale.aggregate({
      where: { 
        status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] }, 
        saleDate: range 
      },
      _sum: { total: true },
    });
    const sales = Number(salesAgg._sum.total ?? 0);

    const openingStock = range.gte
      ? await this.stockValue(new Date(range.gte.getTime() - 1))
      : { totalQty: 0, totalValue: 0 };
    const closingStock = await this.stockValue(range.lte);

    const purchasesAgg = await this.prisma.purchase.aggregate({
      where: { purchaseDate: range },
      _sum: { total: true },
    });
    const purchases = Number(purchasesAgg._sum.total ?? 0);

    const costOfSales = openingStock.totalValue + purchases - closingStock.totalValue;
    const grossProfit = sales - costOfSales;

    const expenseGroups = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: { expenseDate: range },
      _sum: { amount: true },
    });
    const categories = await this.prisma.expenseCategory.findMany();
    const expenses = expenseGroups.map((g) => ({
      category: categories.find((c) => c.id === g.categoryId)?.name ?? 'Unknown',
      amount: Number(g._sum.amount ?? 0),
    }));
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    const netProfit = grossProfit - totalExpenses;

    return {
      from: from ?? null,
      to: to ?? null,
      sales,
      costOfSales: {
        opening: openingStock.totalValue,
        purchases,
        closing: closingStock.totalValue,
        total: costOfSales,
      },
      grossProfit,
      expenses,
      totalExpenses,
      netProfit,
    };
  }

  // ---------------- Balance Sheet ----------------
  async balanceSheet(asOfDate?: string) {
    const asOf = asOfDate ? localEndOfDay(asOfDate) : undefined;

    const fixedAssets = await this.prisma.fixedAsset.findMany({
      where: asOf ? { acquiredDate: { lte: asOf } } : undefined,
    });
    const totalNonCurrentAssets = fixedAssets.reduce((s, a) => s + Number(a.cost), 0);

    const stock = await this.stockValue(asOf);

    const cashAccounts = await this.prisma.cashAccount.findMany({ where: { isActive: true } });
    const cashBalances: Array<{ name: string; type: string; balance: number }> = [];
    let totalCash = 0;
    for (const acc of cashAccounts) {
      const agg = await this.prisma.cashAccountTransaction.aggregate({
        where: { 
          cashAccountId: acc.id, 
          ...(asOf ? { transactionDate: { lte: asOf } } : {}) 
        },
        _sum: { amount: true },
      });
      const balance = Number(agg._sum.amount ?? 0);
      cashBalances.push({ name: acc.name, type: acc.type, balance });
      totalCash += balance;
    }

    const receivables = await this.customerCredit();
    const totalReceivables = receivables.reduce((s, r) => s + r.outstanding, 0);

    const totalCurrentAssets = stock.totalValue + totalCash + totalReceivables;
    const totalAssets = totalNonCurrentAssets + totalCurrentAssets;

    const payables = await this.supplierDebt();
    const totalLiabilities = payables.reduce((s, p) => s + p.outstanding, 0);

    const capitalTxns = await this.prisma.capitalTransaction.findMany({
      where: asOf ? { transactionDate: { lte: asOf } } : undefined,
      include: { partner: true },
    });
    const byPartner = new Map<string, { partner: string; contributions: number; drawings: number }>();
    for (const t of capitalTxns) {
      const entry = byPartner.get(t.partnerId) ?? { 
        partner: t.partner.name, 
        contributions: 0, 
        drawings: 0 
      };
      if (t.transactionType === 'CONTRIBUTION') entry.contributions += Number(t.amount);
      else entry.drawings += Number(t.amount);
      byPartner.set(t.partnerId, entry);
    }
    const capitalAccounts = Array.from(byPartner.values()).map((e) => ({
      ...e,
      balance: e.contributions - e.drawings,
    }));
    const totalCapital = capitalAccounts.reduce((s, c) => s + c.balance, 0);

    const retainedEarnings = await this.plStatement(undefined, asOfDate);
    const totalEquity = totalCapital + retainedEarnings.netProfit;

    return {
      asOfDate: asOfDate ?? null,
      nonCurrentAssets: { fixedAssets, total: totalNonCurrentAssets },
      currentAssets: {
        stock: stock.totalValue,
        cash: { accounts: cashBalances, total: totalCash },
        receivables: totalReceivables,
        total: totalCurrentAssets,
      },
      totalAssets,
      liabilities: { payables, total: totalLiabilities },
      equity: {
        capitalAccounts,
        totalCapital,
        retainedEarnings: retainedEarnings.netProfit,
        total: totalEquity,
      },
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
      checkDifference: totalAssets - (totalLiabilities + totalEquity),
    };
  }

  // ---------------- Capital accounts report ----------------
  async capitalAccountsSummary() {
    const partners = await this.prisma.partner.findMany();
    const results: Array<{ partner: string; contributions: number; drawings: number; balance: number }> = [];
    for (const p of partners) {
      const agg = await this.prisma.capitalTransaction.groupBy({
        by: ['transactionType'],
        where: { partnerId: p.id },
        _sum: { amount: true },
      });
      const sum = (t: string) => Number(agg.find((a) => a.transactionType === t)?._sum.amount ?? 0);
      const contributions = sum('CONTRIBUTION');
      const drawings = sum('DRAWING');
      results.push({ partner: p.name, contributions, drawings, balance: contributions - drawings });
    }
    return results;
  }

  // ---------------- Cash book (multi-account) report ----------------
  async cashBook(from?: string, to?: string) {
    const range = dateRange(from, to);
    const accounts = await this.prisma.cashAccount.findMany({ where: { isActive: true } });

    const results: Array<{
      account: string;
      type: string;
      openingBalance: number;
      totalIn: number;
      totalOut: number;
      closingBalance: number;
    }> = [];
    for (const acc of accounts) {
      let openingBalance = 0;
      if (range.gte) {
        const openingAgg = await this.prisma.cashAccountTransaction.aggregate({
          where: { 
            cashAccountId: acc.id, 
            transactionDate: { lt: range.gte } 
          },
          _sum: { amount: true },
        });
        openingBalance = Number(openingAgg._sum.amount ?? 0);
      }

      const periodTxns = await this.prisma.cashAccountTransaction.findMany({
        where: { 
          cashAccountId: acc.id, 
          transactionDate: range 
        },
      });
      const totalIn = periodTxns.filter((t) => Number(t.amount) > 0).reduce((s, t) => s + Number(t.amount), 0);
      const totalOut = periodTxns.filter((t) => Number(t.amount) < 0).reduce((s, t) => s + Number(t.amount), 0);

      results.push({
        account: acc.name,
        type: acc.type,
        openingBalance,
        totalIn,
        totalOut,
        closingBalance: openingBalance + totalIn + totalOut,
      });
    }
    return results;
  }
}