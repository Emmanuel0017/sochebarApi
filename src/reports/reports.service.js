"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
var common_1 = require("@nestjs/common");
function dateRange(from, to) {
    return {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
    };
}
var ReportsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReportsService = _classThis = /** @class */ (function () {
        function ReportsService_1(prisma) {
            this.prisma = prisma;
        }
        // ---------------- Daily sales report ----------------
        ReportsService_1.prototype.dailySales = function (date) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end, sales, totalSales, discounts, byMethod, _i, sales_1, sale, _a, _b, p, refunds;
                var _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0:
                            start = new Date(date);
                            start.setHours(0, 0, 0, 0);
                            end = new Date(date);
                            end.setHours(23, 59, 59, 999);
                            return [4 /*yield*/, this.prisma.sale.findMany({
                                    where: { saleDate: { gte: start, lte: end }, status: { in: ['COMPLETED', 'PARTIALLY_REFUNDED'] } },
                                    include: { payments: true },
                                })];
                        case 1:
                            sales = _l.sent();
                            totalSales = sales.reduce(function (s, sale) { return s + Number(sale.total); }, 0);
                            discounts = sales.reduce(function (s, sale) { return s + Number(sale.discount); }, 0);
                            byMethod = {};
                            for (_i = 0, sales_1 = sales; _i < sales_1.length; _i++) {
                                sale = sales_1[_i];
                                for (_a = 0, _b = sale.payments; _a < _b.length; _a++) {
                                    p = _b[_a];
                                    byMethod[p.paymentMethod] = ((_c = byMethod[p.paymentMethod]) !== null && _c !== void 0 ? _c : 0) + Number(p.amount);
                                }
                            }
                            return [4 /*yield*/, this.prisma.sale.aggregate({
                                    where: { saleDate: { gte: start, lte: end }, status: { in: ['REFUNDED', 'PARTIALLY_REFUNDED', 'VOIDED'] } },
                                    _sum: { total: true },
                                })];
                        case 2:
                            refunds = _l.sent();
                            return [2 /*return*/, {
                                    date: date,
                                    totalSales: totalSales,
                                    discounts: discounts,
                                    refunds: Number((_d = refunds._sum.total) !== null && _d !== void 0 ? _d : 0),
                                    payments: {
                                        cash: (_e = byMethod.CASH) !== null && _e !== void 0 ? _e : 0,
                                        airtelMoney: (_f = byMethod.AIRTEL_MONEY) !== null && _f !== void 0 ? _f : 0,
                                        mpamba: (_g = byMethod.MPAMBA) !== null && _g !== void 0 ? _g : 0,
                                        bank: (_h = byMethod.BANK) !== null && _h !== void 0 ? _h : 0,
                                        credit: (_j = byMethod.CREDIT) !== null && _j !== void 0 ? _j : 0,
                                        other: (_k = byMethod.OTHER) !== null && _k !== void 0 ? _k : 0,
                                    },
                                }];
                    }
                });
            });
        };
        // ---------------- Product sales report ----------------
        ReportsService_1.prototype.productSales = function (from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var items, map, _i, items_1, item, key, entry, results, _a, _b, entry, lastPurchase, unitCost, cost, grossProfit, margin;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.prisma.saleItem.findMany({
                                where: { sale: { status: 'COMPLETED', saleDate: dateRange(from, to) } },
                                include: { product: true },
                            })];
                        case 1:
                            items = _d.sent();
                            map = new Map();
                            for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                                item = items_1[_i];
                                key = item.productId;
                                entry = (_c = map.get(key)) !== null && _c !== void 0 ? _c : { productId: key, name: item.product.name, qty: 0, revenue: 0 };
                                entry.qty += Number(item.quantity);
                                entry.revenue += Number(item.total);
                                map.set(key, entry);
                            }
                            results = [];
                            _a = 0, _b = map.values();
                            _d.label = 2;
                        case 2:
                            if (!(_a < _b.length)) return [3 /*break*/, 5];
                            entry = _b[_a];
                            return [4 /*yield*/, this.prisma.purchaseItem.findFirst({
                                    where: { productId: entry.productId },
                                    orderBy: { id: 'desc' },
                                })];
                        case 3:
                            lastPurchase = _d.sent();
                            unitCost = lastPurchase ? Number(lastPurchase.unitCost) : 0;
                            cost = unitCost * entry.qty;
                            grossProfit = entry.revenue - cost;
                            margin = entry.revenue > 0 ? (grossProfit / entry.revenue) * 100 : 0;
                            results.push(__assign(__assign({}, entry), { cost: cost, grossProfit: grossProfit, marginPercent: Number(margin.toFixed(2)) }));
                            _d.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, results.sort(function (a, b) { return b.revenue - a.revenue; })];
                    }
                });
            });
        };
        // ---------------- Inventory report ----------------
        ReportsService_1.prototype.inventory = function (productId) {
            return __awaiter(this, void 0, void 0, function () {
                var products, results, _loop_1, this_1, _i, products_1, p;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findMany({
                                where: { id: productId, trackInventory: true },
                                include: { units: { where: { isBaseUnit: true } } },
                            })];
                        case 1:
                            products = _c.sent();
                            results = [];
                            _loop_1 = function (p) {
                                var agg, sum, purchases, sales, wastage, adjustments, returns, expectedStock;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, this_1.prisma.inventoryTransaction.groupBy({
                                                by: ['transactionType'],
                                                where: { productId: p.id },
                                                _sum: { quantity: true },
                                            })];
                                        case 1:
                                            agg = _d.sent();
                                            sum = function (t) { var _a, _b; return Number((_b = (_a = agg.find(function (a) { return a.transactionType === t; })) === null || _a === void 0 ? void 0 : _a._sum.quantity) !== null && _b !== void 0 ? _b : 0); };
                                            purchases = sum('PURCHASE');
                                            sales = Math.abs(sum('SALE'));
                                            wastage = Math.abs(sum('WASTAGE'));
                                            adjustments = sum('ADJUSTMENT');
                                            returns = sum('RETURN');
                                            expectedStock = purchases + sales * -1 + wastage * -1 + adjustments + returns;
                                            results.push({
                                                productId: p.id,
                                                name: p.name,
                                                baseUnit: (_b = (_a = p.units[0]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'unit',
                                                purchases: purchases,
                                                sales: sales,
                                                wastage: wastage,
                                                adjustments: adjustments,
                                                expectedStock: expectedStock,
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, products_1 = products;
                            _c.label = 2;
                        case 2:
                            if (!(_i < products_1.length)) return [3 /*break*/, 5];
                            p = products_1[_i];
                            return [5 /*yield**/, _loop_1(p)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, results];
                    }
                });
            });
        };
        // ---------------- Purchase report ----------------
        ReportsService_1.prototype.purchases = function (from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var purchases, map, _i, purchases_1, p, entry;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.purchase.findMany({
                                where: { purchaseDate: dateRange(from, to) },
                                include: { supplier: true },
                            })];
                        case 1:
                            purchases = _b.sent();
                            map = new Map();
                            for (_i = 0, purchases_1 = purchases; _i < purchases_1.length; _i++) {
                                p = purchases_1[_i];
                                entry = (_a = map.get(p.supplierId)) !== null && _a !== void 0 ? _a : {
                                    supplierId: p.supplierId,
                                    name: p.supplier.name,
                                    count: 0,
                                    total: 0,
                                    paid: 0,
                                };
                                entry.count += 1;
                                entry.total += Number(p.total);
                                entry.paid += Number(p.amountPaid);
                                map.set(p.supplierId, entry);
                            }
                            return [2 /*return*/, Array.from(map.values()).map(function (e) { return (__assign(__assign({}, e), { outstanding: e.total - e.paid })); })];
                    }
                });
            });
        };
        // ---------------- Expense report ----------------
        ReportsService_1.prototype.expenses = function (from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var grouped, categories;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.expense.groupBy({
                                by: ['categoryId'],
                                where: { expenseDate: dateRange(from, to) },
                                _sum: { amount: true },
                            })];
                        case 1:
                            grouped = _a.sent();
                            return [4 /*yield*/, this.prisma.expenseCategory.findMany()];
                        case 2:
                            categories = _a.sent();
                            return [2 /*return*/, grouped.map(function (g) {
                                    var _a, _b, _c;
                                    return ({
                                        category: (_b = (_a = categories.find(function (c) { return c.id === g.categoryId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Unknown',
                                        totalAmount: Number((_c = g._sum.amount) !== null && _c !== void 0 ? _c : 0),
                                    });
                                })];
                    }
                });
            });
        };
        // ---------------- Cash report ----------------
        ReportsService_1.prototype.cash = function (sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, txns, sum;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.cashSession.findUniqueOrThrow({ where: { id: sessionId } })];
                        case 1:
                            session = _a.sent();
                            return [4 /*yield*/, this.prisma.cashTransaction.groupBy({
                                    by: ['transactionType'],
                                    where: { cashSessionId: sessionId },
                                    _sum: { amount: true },
                                })];
                        case 2:
                            txns = _a.sent();
                            sum = function (t) { var _a, _b; return Number((_b = (_a = txns.find(function (x) { return x.transactionType === t; })) === null || _a === void 0 ? void 0 : _a._sum.amount) !== null && _b !== void 0 ? _b : 0); };
                            return [2 /*return*/, {
                                    openingCash: Number(session.openingCash),
                                    cashSales: sum('SALE'),
                                    cashExpenses: sum('EXPENSE'),
                                    withdrawals: sum('WITHDRAWAL'),
                                    deposits: sum('DEPOSIT'),
                                    expectedCash: session.expectedCash ? Number(session.expectedCash) : null,
                                    actualCash: session.actualCash ? Number(session.actualCash) : null,
                                    difference: session.difference ? Number(session.difference) : null,
                                }];
                    }
                });
            });
        };
        // ---------------- Credit report (customers) ----------------
        ReportsService_1.prototype.customerCredit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var customers, results, _loop_2, this_2, _i, customers_1, c;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.customer.findMany()];
                        case 1:
                            customers = _a.sent();
                            results = [];
                            _loop_2 = function (c) {
                                var agg, sum, creditSales, payments;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this_2.prisma.customerTransaction.groupBy({
                                                by: ['transactionType'],
                                                where: { customerId: c.id },
                                                _sum: { amount: true },
                                            })];
                                        case 1:
                                            agg = _b.sent();
                                            sum = function (t) { var _a, _b; return Number((_b = (_a = agg.find(function (a) { return a.transactionType === t; })) === null || _a === void 0 ? void 0 : _a._sum.amount) !== null && _b !== void 0 ? _b : 0); };
                                            creditSales = sum('CREDIT_SALE');
                                            payments = sum('PAYMENT');
                                            results.push({ customer: c.name, creditSales: creditSales, payments: payments, outstanding: creditSales - payments });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_2 = this;
                            _i = 0, customers_1 = customers;
                            _a.label = 2;
                        case 2:
                            if (!(_i < customers_1.length)) return [3 /*break*/, 5];
                            c = customers_1[_i];
                            return [5 /*yield**/, _loop_2(c)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, results.filter(function (r) { return r.creditSales !== 0 || r.outstanding !== 0; })];
                    }
                });
            });
        };
        // ---------------- Supplier debt report ----------------
        ReportsService_1.prototype.supplierDebt = function () {
            return __awaiter(this, void 0, void 0, function () {
                var suppliers, results, _loop_3, this_3, _i, suppliers_1, s;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.supplier.findMany()];
                        case 1:
                            suppliers = _a.sent();
                            results = [];
                            _loop_3 = function (s) {
                                var agg, sum, purchases, payments;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this_3.prisma.supplierTransaction.groupBy({
                                                by: ['transactionType'],
                                                where: { supplierId: s.id },
                                                _sum: { amount: true },
                                            })];
                                        case 1:
                                            agg = _b.sent();
                                            sum = function (t) { var _a, _b; return Number((_b = (_a = agg.find(function (a) { return a.transactionType === t; })) === null || _a === void 0 ? void 0 : _a._sum.amount) !== null && _b !== void 0 ? _b : 0); };
                                            purchases = sum('PURCHASE');
                                            payments = sum('PAYMENT');
                                            results.push({ supplier: s.name, purchases: purchases, payments: payments, outstanding: purchases - payments });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_3 = this;
                            _i = 0, suppliers_1 = suppliers;
                            _a.label = 2;
                        case 2:
                            if (!(_i < suppliers_1.length)) return [3 /*break*/, 5];
                            s = suppliers_1[_i];
                            return [5 /*yield**/, _loop_3(s)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, results.filter(function (r) { return r.purchases !== 0 || r.outstanding !== 0; })];
                    }
                });
            });
        };
        // ---------------- Profit report ----------------
        ReportsService_1.prototype.profit = function (from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var productSales, revenue, cogs, grossProfit, expenseAgg, operatingExpenses, netProfit;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.productSales(from, to)];
                        case 1:
                            productSales = _b.sent();
                            revenue = productSales.reduce(function (s, p) { return s + p.revenue; }, 0);
                            cogs = productSales.reduce(function (s, p) { return s + p.cost; }, 0);
                            grossProfit = revenue - cogs;
                            return [4 /*yield*/, this.prisma.expense.aggregate({
                                    where: { expenseDate: dateRange(from, to) },
                                    _sum: { amount: true },
                                })];
                        case 2:
                            expenseAgg = _b.sent();
                            operatingExpenses = Number((_a = expenseAgg._sum.amount) !== null && _a !== void 0 ? _a : 0);
                            netProfit = grossProfit - operatingExpenses;
                            return [2 /*return*/, { revenue: revenue, cogs: cogs, grossProfit: grossProfit, operatingExpenses: operatingExpenses, netProfit: netProfit }];
                    }
                });
            });
        };
        return ReportsService_1;
    }());
    __setFunctionName(_classThis, "ReportsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsService = _classThis;
}();
exports.ReportsService = ReportsService;
