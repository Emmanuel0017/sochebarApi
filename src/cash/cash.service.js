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
exports.CashService = void 0;
var common_1 = require("@nestjs/common");
var CashService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CashService = _classThis = /** @class */ (function () {
        function CashService_1(prisma, auditService) {
            this.prisma = prisma;
            this.auditService = auditService;
        }
        CashService_1.prototype.getCurrentSession = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.cashSession.findFirst({
                            where: { userId: userId, status: 'OPEN' },
                            include: { cashTransactions: true },
                        })];
                });
            });
        };
        CashService_1.prototype.openSession = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCurrentSession(userId)];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.BadRequestException('A cash session is already open for this user');
                            return [4 /*yield*/, this.prisma.cashSession.create({
                                    data: { userId: userId, openingCash: dto.openingCash },
                                })];
                        case 2:
                            session = _a.sent();
                            return [4 /*yield*/, this.prisma.cashTransaction.create({
                                    data: {
                                        cashSessionId: session.id,
                                        transactionType: 'OPENING_BALANCE',
                                        amount: dto.openingCash,
                                        description: 'Session opened',
                                        createdById: userId,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'OPEN_CASH_SESSION',
                                    entityType: 'CashSession',
                                    entityId: session.id,
                                    newValues: { openingCash: dto.openingCash },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, session];
                    }
                });
            });
        };
        /**
         * Expected cash = Opening + Cash Sales + Deposits - Expenses - Withdrawals - Refunds
         * (design doc section 22).
         */
        CashService_1.prototype.computeExpectedCash = function (sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, txns, sum, expected;
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
                            sum = function (type) { var _a, _b; return Number((_b = (_a = txns.find(function (t) { return t.transactionType === type; })) === null || _a === void 0 ? void 0 : _a._sum.amount) !== null && _b !== void 0 ? _b : 0); };
                            expected = Number(session.openingCash) +
                                sum('SALE') +
                                sum('DEPOSIT') -
                                sum('EXPENSE') -
                                sum('WITHDRAWAL') -
                                sum('REFUND') +
                                sum('ADJUSTMENT');
                            return [2 /*return*/, expected];
                    }
                });
            });
        };
        CashService_1.prototype.closeSession = function (sessionId, dto, actorId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, expectedCash, difference, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.cashSession.findUnique({ where: { id: sessionId } })];
                        case 1:
                            session = _a.sent();
                            if (!session)
                                throw new common_1.NotFoundException('Cash session not found');
                            if (session.status === 'CLOSED')
                                throw new common_1.BadRequestException('Session already closed');
                            return [4 /*yield*/, this.computeExpectedCash(sessionId)];
                        case 2:
                            expectedCash = _a.sent();
                            difference = dto.actualCash - expectedCash;
                            return [4 /*yield*/, this.prisma.cashSession.update({
                                    where: { id: sessionId },
                                    data: {
                                        status: 'CLOSED',
                                        closedAt: new Date(),
                                        expectedCash: expectedCash,
                                        actualCash: dto.actualCash,
                                        difference: difference,
                                    },
                                })];
                        case 3:
                            updated = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: actorId,
                                    action: 'CLOSE_CASH_SESSION',
                                    entityType: 'CashSession',
                                    entityId: sessionId,
                                    newValues: { expectedCash: expectedCash, actualCash: dto.actualCash, difference: difference },
                                })];
                        case 4:
                            _a.sent();
                            // A non-zero difference is recorded, not hidden - the manager reviews it
                            // via the cash report / dashboard reconciliation widget.
                            return [2 /*return*/, __assign(__assign({}, updated), { flagged: Math.abs(difference) > 0 })];
                    }
                });
            });
        };
        CashService_1.prototype.getTransactions = function (sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.cashTransaction.findMany({
                            where: { cashSessionId: sessionId },
                            orderBy: { createdAt: 'asc' },
                        })];
                });
            });
        };
        CashService_1.prototype.recordTransaction = function (sessionId, dto, actorId) {
            return __awaiter(this, void 0, void 0, function () {
                var session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.cashSession.findUnique({ where: { id: sessionId } })];
                        case 1:
                            session = _a.sent();
                            if (!session || session.status !== 'OPEN') {
                                throw new common_1.BadRequestException('Cash session is not open');
                            }
                            return [2 /*return*/, this.prisma.cashTransaction.create({
                                    data: {
                                        cashSessionId: sessionId,
                                        transactionType: dto.transactionType,
                                        amount: dto.amount,
                                        description: dto.description,
                                        createdById: actorId,
                                    },
                                })];
                    }
                });
            });
        };
        return CashService_1;
    }());
    __setFunctionName(_classThis, "CashService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CashService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CashService = _classThis;
}();
exports.CashService = CashService;
