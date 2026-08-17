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
exports.InventoryService = void 0;
var common_1 = require("@nestjs/common");
var STOCK_OUT_TYPES = ['SALE', 'WASTAGE', 'DAMAGE', 'TRANSFER_OUT'];
var InventoryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InventoryService = _classThis = /** @class */ (function () {
        function InventoryService_1(prisma) {
            this.prisma = prisma;
        }
        /**
         * Records a single stock movement as an immutable ledger entry.
         * Quantity is converted to the product's base unit and stored SIGNED:
         * positive = stock increase, negative = stock decrease.
         * ADJUSTMENT is the only type whose sign is taken directly from the caller
         * (since an adjustment can go either way) - all other types have a fixed
         * direction enforced here so callers can't accidentally reverse the sign.
         */
        InventoryService_1.prototype.recordMovement = function (params_1) {
            return __awaiter(this, arguments, void 0, function (params, client) {
                var unit, baseQuantity, signedQuantity;
                if (client === void 0) { client = this.prisma; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.productUnit.findUnique({ where: { id: params.unitId } })];
                        case 1:
                            unit = _a.sent();
                            if (!unit)
                                throw new common_1.BadRequestException('Invalid unit');
                            baseQuantity = params.quantityInUnit * Number(unit.quantityInBaseUnit);
                            if (params.transactionType === 'ADJUSTMENT') {
                                signedQuantity = baseQuantity; // caller passes signed value already
                            }
                            else if (STOCK_OUT_TYPES.includes(params.transactionType)) {
                                signedQuantity = -Math.abs(baseQuantity);
                            }
                            else {
                                signedQuantity = Math.abs(baseQuantity);
                            }
                            return [2 /*return*/, client.inventoryTransaction.create({
                                    data: {
                                        productId: params.productId,
                                        unitId: params.unitId,
                                        transactionType: params.transactionType,
                                        quantity: signedQuantity,
                                        referenceType: params.referenceType,
                                        referenceId: params.referenceId,
                                        purchaseId: params.purchaseId,
                                        saleId: params.saleId,
                                        unitCost: params.unitCost,
                                        createdById: params.createdById,
                                    },
                                })];
                    }
                });
            });
        };
        /** Current stock on hand for a product, expressed in BASE units. */
        InventoryService_1.prototype.getCurrentStock = function (productId_1) {
            return __awaiter(this, arguments, void 0, function (productId, client) {
                var result;
                var _a;
                if (client === void 0) { client = this.prisma; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, client.inventoryTransaction.aggregate({
                                where: { productId: productId },
                                _sum: { quantity: true },
                            })];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, Number((_a = result._sum.quantity) !== null && _a !== void 0 ? _a : 0)];
                    }
                });
            });
        };
        /** Checks whether there is enough stock (in base units) to fulfill a requested movement. */
        InventoryService_1.prototype.assertSufficientStock = function (productId_1, requiredBaseQuantity_1) {
            return __awaiter(this, arguments, void 0, function (productId, requiredBaseQuantity, client) {
                var current;
                if (client === void 0) { client = this.prisma; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCurrentStock(productId, client)];
                        case 1:
                            current = _a.sent();
                            if (current < requiredBaseQuantity) {
                                throw new common_1.BadRequestException("Insufficient stock: have ".concat(current, ", need ").concat(requiredBaseQuantity));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.getHistory = function (productId_1) {
            return __awaiter(this, arguments, void 0, function (productId, take, skip) {
                if (take === void 0) { take = 100; }
                if (skip === void 0) { skip = 0; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.inventoryTransaction.findMany({
                            where: { productId: productId },
                            orderBy: { createdAt: 'desc' },
                            take: take,
                            skip: skip,
                            include: { unit: true, createdBy: { select: { id: true, name: true } } },
                        })];
                });
            });
        };
        InventoryService_1.prototype.getStockSummary = function () {
            return __awaiter(this, void 0, void 0, function () {
                var products, summaries;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.product.findMany({
                                where: { isActive: true, trackInventory: true },
                                include: { units: { where: { isBaseUnit: true } } },
                            })];
                        case 1:
                            products = _a.sent();
                            return [4 /*yield*/, Promise.all(products.map(function (p) { return __awaiter(_this, void 0, void 0, function () {
                                    var stock;
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, this.getCurrentStock(p.id)];
                                            case 1:
                                                stock = _c.sent();
                                                return [2 /*return*/, { productId: p.id, name: p.name, baseUnit: (_b = (_a = p.units[0]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'unit', stock: stock }];
                                        }
                                    });
                                }); }))];
                        case 2:
                            summaries = _a.sent();
                            return [2 /*return*/, summaries];
                    }
                });
            });
        };
        return InventoryService_1;
    }());
    __setFunctionName(_classThis, "InventoryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InventoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InventoryService = _classThis;
}();
exports.InventoryService = InventoryService;
