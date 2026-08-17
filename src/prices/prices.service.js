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
exports.PricesService = void 0;
var common_1 = require("@nestjs/common");
var PricesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PricesService = _classThis = /** @class */ (function () {
        function PricesService_1(prisma) {
            this.prisma = prisma;
        }
        PricesService_1.prototype.findAllForProduct = function (productId) {
            return this.prisma.productPrice.findMany({
                where: { productId: productId },
                orderBy: { effectiveFrom: 'desc' },
                include: { unit: true },
            });
        };
        // Returns the currently active price for a product/unit/priceType combination.
        PricesService_1.prototype.getCurrentPrice = function (productId_1, unitId_1) {
            return __awaiter(this, arguments, void 0, function (productId, unitId, priceType) {
                var now, price;
                if (priceType === void 0) { priceType = 'NORMAL'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            return [4 /*yield*/, this.prisma.productPrice.findFirst({
                                    where: {
                                        productId: productId,
                                        unitId: unitId,
                                        priceType: priceType,
                                        effectiveFrom: { lte: now },
                                        OR: [{ effectiveTo: null }, { effectiveTo: { gte: now } }],
                                    },
                                    orderBy: { effectiveFrom: 'desc' },
                                })];
                        case 1:
                            price = _a.sent();
                            if (!price)
                                throw new common_1.NotFoundException('No active price found for this product/unit');
                            return [2 /*return*/, price];
                    }
                });
            });
        };
        // Creating a new price closes out (sets effectiveTo) the previously active price
        // of the same product/unit/priceType, so history is preserved but only one is "current".
        PricesService_1.prototype.create = function (productId, dto, createdById) {
            return __awaiter(this, void 0, void 0, function () {
                var now;
                var _this = this;
                return __generator(this, function (_a) {
                    now = new Date();
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, tx.productPrice.updateMany({
                                            where: {
                                                productId: productId,
                                                unitId: dto.unitId,
                                                priceType: (_a = dto.priceType) !== null && _a !== void 0 ? _a : 'NORMAL',
                                                effectiveTo: null,
                                            },
                                            data: { effectiveTo: now },
                                        })];
                                    case 1:
                                        _c.sent();
                                        return [2 /*return*/, tx.productPrice.create({
                                                data: {
                                                    productId: productId,
                                                    unitId: dto.unitId,
                                                    price: dto.price,
                                                    priceType: (_b = dto.priceType) !== null && _b !== void 0 ? _b : 'NORMAL',
                                                    effectiveFrom: now,
                                                    createdById: createdById,
                                                },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        PricesService_1.prototype.update = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var price;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.productPrice.findUnique({ where: { id: id } })];
                        case 1:
                            price = _a.sent();
                            if (!price)
                                throw new common_1.NotFoundException('Price not found');
                            // Historical prices already used in completed sales must never be mutated in
                            // a way that changes what was charged - only administrative metadata (like
                            // closing the effective window early) is allowed here.
                            return [2 /*return*/, this.prisma.productPrice.update({
                                    where: { id: id },
                                    data: { effectiveTo: dto.effectiveTo ? new Date(dto.effectiveTo) : undefined },
                                })];
                    }
                });
            });
        };
        return PricesService_1;
    }());
    __setFunctionName(_classThis, "PricesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PricesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PricesService = _classThis;
}();
exports.PricesService = PricesService;
