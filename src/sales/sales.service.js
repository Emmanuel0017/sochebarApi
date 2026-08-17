"use strict";
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
exports.SalesService = void 0;
var common_1 = require("@nestjs/common");
var SalesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SalesService = _classThis = /** @class */ (function () {
        function SalesService_1(prisma, inventoryService, cashService, customersService, auditService) {
            this.prisma = prisma;
            this.inventoryService = inventoryService;
            this.cashService = cashService;
            this.customersService = customersService;
            this.auditService = auditService;
        }
        SalesService_1.prototype.findAll = function (params) {
            return this.prisma.sale.findMany({
                where: {
                    status: params.status,
                    userId: params.userId,
                    saleDate: params.from || params.to
                        ? { gte: params.from ? new Date(params.from) : undefined, lte: params.to ? new Date(params.to) : undefined }
                        : undefined,
                },
                include: { items: true, payments: true, customer: true, user: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'desc' },
            });
        };
        SalesService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var sale;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.sale.findUnique({
                                where: { id: id },
                                include: {
                                    items: { include: { product: true, unit: true } },
                                    payments: true,
                                    customer: true,
                                    user: { select: { id: true, name: true } },
                                },
                            })];
                        case 1:
                            sale = _a.sent();
                            if (!sale)
                                throw new common_1.NotFoundException('Sale not found');
                            return [2 /*return*/, sale];
                    }
                });
            });
        };
        SalesService_1.prototype.generateInvoiceNumber = function (tx) {
            return __awaiter(this, void 0, void 0, function () {
                var count, datePart;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tx.sale.count()];
                        case 1:
                            count = _a.sent();
                            datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                            return [2 /*return*/, "INV-".concat(datePart, "-").concat(String(count + 1).padStart(5, '0'))];
                    }
                });
            });
        };
        /**
         * A sale is one atomic transaction (design doc section 27):
         *   Create sale -> create items -> validate stock -> decrease inventory ->
         *   create payment records -> update cash/mobile/bank/credit -> audit log.
         * Stock can never go negative; if any item is short, the whole sale rolls back.
         */
        SalesService_1.prototype.create = function (dto, actorId, actorRole) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var subtotal, discount, tax, total, paidTotal, creditPortion, nonCreditPaid, _i, _a, item, unit, requiredBase, invoiceNumber, cashSession, sale, _b, _c, item, cashPortion;
                            var _d, _e, _f, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        subtotal = dto.items.reduce(function (sum, i) { var _a; return sum + i.quantity * i.unitPrice - ((_a = i.discount) !== null && _a !== void 0 ? _a : 0); }, 0);
                                        discount = (_d = dto.discount) !== null && _d !== void 0 ? _d : 0;
                                        tax = (_e = dto.tax) !== null && _e !== void 0 ? _e : 0;
                                        total = subtotal - discount + tax;
                                        paidTotal = dto.payments.reduce(function (sum, p) { return sum + p.amount; }, 0);
                                        creditPortion = (_g = (_f = dto.payments.find(function (p) { return p.paymentMethod === 'CREDIT'; })) === null || _f === void 0 ? void 0 : _f.amount) !== null && _g !== void 0 ? _g : 0;
                                        nonCreditPaid = paidTotal - creditPortion;
                                        if (creditPortion > 0 && !dto.customerId) {
                                            throw new common_1.BadRequestException('Credit sales require a customer');
                                        }
                                        if (paidTotal < total - 0.01) {
                                            throw new common_1.BadRequestException("Payments (".concat(paidTotal, ") do not cover the sale total (").concat(total, ")"));
                                        }
                                        if (!(creditPortion > 0 && dto.customerId)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.customersService.assertWithinCreditLimit(dto.customerId, creditPortion)];
                                    case 1:
                                        _h.sent();
                                        _h.label = 2;
                                    case 2:
                                        _i = 0, _a = dto.items;
                                        _h.label = 3;
                                    case 3:
                                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                                        item = _a[_i];
                                        return [4 /*yield*/, tx.productUnit.findUniqueOrThrow({ where: { id: item.unitId } })];
                                    case 4:
                                        unit = _h.sent();
                                        requiredBase = item.quantity * Number(unit.quantityInBaseUnit);
                                        return [4 /*yield*/, this.inventoryService.assertSufficientStock(item.productId, requiredBase, tx)];
                                    case 5:
                                        _h.sent();
                                        _h.label = 6;
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 3];
                                    case 7: return [4 /*yield*/, this.generateInvoiceNumber(tx)];
                                    case 8:
                                        invoiceNumber = _h.sent();
                                        return [4 /*yield*/, tx.cashSession.findFirst({ where: { userId: actorId, status: 'OPEN' } })];
                                    case 9:
                                        cashSession = _h.sent();
                                        return [4 /*yield*/, tx.sale.create({
                                                data: {
                                                    invoiceNumber: invoiceNumber,
                                                    userId: actorId,
                                                    customerId: dto.customerId,
                                                    cashSessionId: cashSession === null || cashSession === void 0 ? void 0 : cashSession.id,
                                                    subtotal: subtotal,
                                                    discount: discount,
                                                    tax: tax,
                                                    total: total,
                                                    status: 'COMPLETED',
                                                    items: {
                                                        create: dto.items.map(function (i) {
                                                            var _a, _b;
                                                            return ({
                                                                productId: i.productId,
                                                                unitId: i.unitId,
                                                                quantity: i.quantity,
                                                                unitPrice: i.unitPrice,
                                                                discount: (_a = i.discount) !== null && _a !== void 0 ? _a : 0,
                                                                total: i.quantity * i.unitPrice - ((_b = i.discount) !== null && _b !== void 0 ? _b : 0),
                                                            });
                                                        }),
                                                    },
                                                    payments: {
                                                        create: dto.payments.map(function (p) { return ({
                                                            paymentMethod: p.paymentMethod,
                                                            amount: p.amount,
                                                            reference: p.reference,
                                                            createdById: actorId,
                                                        }); }),
                                                    },
                                                },
                                                include: { items: true, payments: true },
                                            })];
                                    case 10:
                                        sale = _h.sent();
                                        _b = 0, _c = dto.items;
                                        _h.label = 11;
                                    case 11:
                                        if (!(_b < _c.length)) return [3 /*break*/, 14];
                                        item = _c[_b];
                                        return [4 /*yield*/, this.inventoryService.recordMovement({
                                                productId: item.productId,
                                                unitId: item.unitId,
                                                transactionType: 'SALE',
                                                quantityInUnit: item.quantity,
                                                referenceType: 'SALE',
                                                referenceId: sale.id,
                                                saleId: sale.id,
                                                createdById: actorId,
                                            }, tx)];
                                    case 12:
                                        _h.sent();
                                        _h.label = 13;
                                    case 13:
                                        _b++;
                                        return [3 /*break*/, 11];
                                    case 14:
                                        if (!(cashSession && nonCreditPaid > 0)) return [3 /*break*/, 16];
                                        cashPortion = dto.payments
                                            .filter(function (p) { return p.paymentMethod === 'CASH'; })
                                            .reduce(function (sum, p) { return sum + p.amount; }, 0);
                                        if (!(cashPortion > 0)) return [3 /*break*/, 16];
                                        return [4 /*yield*/, tx.cashTransaction.create({
                                                data: {
                                                    cashSessionId: cashSession.id,
                                                    transactionType: 'SALE',
                                                    amount: cashPortion,
                                                    referenceType: 'SALE',
                                                    referenceId: sale.id,
                                                    saleId: sale.id,
                                                    description: "Sale ".concat(invoiceNumber),
                                                    createdById: actorId,
                                                },
                                            })];
                                    case 15:
                                        _h.sent();
                                        _h.label = 16;
                                    case 16:
                                        if (!(creditPortion > 0 && dto.customerId)) return [3 /*break*/, 18];
                                        return [4 /*yield*/, tx.customerTransaction.create({
                                                data: {
                                                    customerId: dto.customerId,
                                                    transactionType: 'CREDIT_SALE',
                                                    amount: creditPortion,
                                                    referenceType: 'SALE',
                                                    referenceId: sale.id,
                                                    saleId: sale.id,
                                                    description: "Credit sale ".concat(invoiceNumber),
                                                },
                                            })];
                                    case 17:
                                        _h.sent();
                                        _h.label = 18;
                                    case 18: return [4 /*yield*/, this.auditService.log({
                                            userId: actorId,
                                            action: 'CREATE_SALE',
                                            entityType: 'Sale',
                                            entityId: sale.id,
                                            newValues: { total: total, invoiceNumber: invoiceNumber, itemCount: dto.items.length },
                                        })];
                                    case 19:
                                        _h.sent();
                                        return [2 /*return*/, sale];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Voiding never deletes the sale - it reverses inventory and reopens the
         * financial trail via new (reversing) ledger entries, and the sale row is
         * kept with status=VOIDED for a full audit trail (design doc section 17/26).
         */
        SalesService_1.prototype.void = function (id, dto, actorId, actorRole) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (actorRole === 'CASHIER' || actorRole === 'BARTENDER') {
                        throw new common_1.BadRequestException('Cashiers/bartenders cannot void sales - manager approval required');
                    }
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var sale, _i, _a, item, cashPaid, creditPaid;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, tx.sale.findUnique({ where: { id: id }, include: { items: true, payments: true } })];
                                    case 1:
                                        sale = _b.sent();
                                        if (!sale)
                                            throw new common_1.NotFoundException('Sale not found');
                                        if (sale.status !== 'COMPLETED')
                                            throw new common_1.BadRequestException('Only completed sales can be voided');
                                        return [4 /*yield*/, tx.sale.update({ where: { id: id }, data: { status: 'VOIDED', voidReason: dto.reason } })];
                                    case 2:
                                        _b.sent();
                                        _i = 0, _a = sale.items;
                                        _b.label = 3;
                                    case 3:
                                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                                        item = _a[_i];
                                        return [4 /*yield*/, this.inventoryService.recordMovement({
                                                productId: item.productId,
                                                unitId: item.unitId,
                                                transactionType: 'RETURN',
                                                quantityInUnit: Number(item.quantity),
                                                referenceType: 'SALE',
                                                referenceId: sale.id,
                                                saleId: sale.id,
                                                createdById: actorId,
                                            }, tx)];
                                    case 4:
                                        _b.sent();
                                        _b.label = 5;
                                    case 5:
                                        _i++;
                                        return [3 /*break*/, 3];
                                    case 6:
                                        if (!sale.cashSessionId) return [3 /*break*/, 8];
                                        cashPaid = sale.payments.filter(function (p) { return p.paymentMethod === 'CASH'; }).reduce(function (s, p) { return s + Number(p.amount); }, 0);
                                        if (!(cashPaid > 0)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.cashTransaction.create({
                                                data: {
                                                    cashSessionId: sale.cashSessionId,
                                                    transactionType: 'REFUND',
                                                    amount: cashPaid,
                                                    referenceType: 'SALE',
                                                    referenceId: sale.id,
                                                    saleId: sale.id,
                                                    description: "Void reversal: ".concat(dto.reason),
                                                    createdById: actorId,
                                                },
                                            })];
                                    case 7:
                                        _b.sent();
                                        _b.label = 8;
                                    case 8:
                                        if (!sale.customerId) return [3 /*break*/, 10];
                                        creditPaid = sale.payments
                                            .filter(function (p) { return p.paymentMethod === 'CREDIT'; })
                                            .reduce(function (s, p) { return s + Number(p.amount); }, 0);
                                        if (!(creditPaid > 0)) return [3 /*break*/, 10];
                                        return [4 /*yield*/, tx.customerTransaction.create({
                                                data: {
                                                    customerId: sale.customerId,
                                                    transactionType: 'ADJUSTMENT',
                                                    amount: -creditPaid,
                                                    referenceType: 'SALE',
                                                    referenceId: sale.id,
                                                    saleId: sale.id,
                                                    description: "Void reversal: ".concat(dto.reason),
                                                },
                                            })];
                                    case 9:
                                        _b.sent();
                                        _b.label = 10;
                                    case 10: return [4 /*yield*/, this.auditService.log({
                                            userId: actorId,
                                            action: 'VOID_SALE',
                                            entityType: 'Sale',
                                            entityId: id,
                                            newValues: { reason: dto.reason },
                                        })];
                                    case 11:
                                        _b.sent();
                                        return [2 /*return*/, tx.sale.findUnique({ where: { id: id }, include: { items: true, payments: true } })];
                                }
                            });
                        }); })];
                });
            });
        };
        return SalesService_1;
    }());
    __setFunctionName(_classThis, "SalesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SalesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SalesService = _classThis;
}();
exports.SalesService = SalesService;
