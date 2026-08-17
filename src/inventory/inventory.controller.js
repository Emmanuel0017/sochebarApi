"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.InventoryController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var InventoryController = function () {
    var _classDecorators = [(0, common_1.Controller)('inventory'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getStockSummary_decorators;
    var _getCurrentStock_decorators;
    var _getHistory_decorators;
    var _createAdjustment_decorators;
    var _findAllAdjustments_decorators;
    var _approveAdjustment_decorators;
    var _createWastage_decorators;
    var _findAllWastage_decorators;
    var _approveWastage_decorators;
    var InventoryController = _classThis = /** @class */ (function () {
        function InventoryController_1(inventoryService, stockAdjustmentsService, wastageService) {
            this.inventoryService = (__runInitializers(this, _instanceExtraInitializers), inventoryService);
            this.stockAdjustmentsService = stockAdjustmentsService;
            this.wastageService = wastageService;
        }
        InventoryController_1.prototype.getStockSummary = function () {
            return this.inventoryService.getStockSummary();
        };
        InventoryController_1.prototype.getCurrentStock = function (productId) {
            return __awaiter(this, void 0, void 0, function () {
                var stock;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.inventoryService.getCurrentStock(productId)];
                        case 1:
                            stock = _a.sent();
                            return [2 /*return*/, { productId: productId, stock: stock }];
                    }
                });
            });
        };
        InventoryController_1.prototype.getHistory = function (productId) {
            return this.inventoryService.getHistory(productId);
        };
        InventoryController_1.prototype.createAdjustment = function (dto, user) {
            return this.stockAdjustmentsService.create(dto, user.id, user.role);
        };
        InventoryController_1.prototype.findAllAdjustments = function () {
            return this.stockAdjustmentsService.findAll();
        };
        InventoryController_1.prototype.approveAdjustment = function (id, user) {
            return this.stockAdjustmentsService.approve(id, user.id);
        };
        InventoryController_1.prototype.createWastage = function (dto, user) {
            return this.wastageService.create(dto, user.id);
        };
        InventoryController_1.prototype.findAllWastage = function () {
            return this.wastageService.findAll();
        };
        InventoryController_1.prototype.approveWastage = function (id, user) {
            return this.wastageService.approve(id, user.id);
        };
        return InventoryController_1;
    }());
    __setFunctionName(_classThis, "InventoryController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getStockSummary_decorators = [(0, common_1.Get)()];
        _getCurrentStock_decorators = [(0, common_1.Get)(':productId')];
        _getHistory_decorators = [(0, common_1.Get)(':productId/history')];
        _createAdjustment_decorators = [(0, common_1.Post)('adjustments'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'STOREKEEPER')];
        _findAllAdjustments_decorators = [(0, common_1.Get)('adjustments/all'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER')];
        _approveAdjustment_decorators = [(0, common_1.Patch)('adjustments/:id/approve'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER')];
        _createWastage_decorators = [(0, common_1.Post)('wastage'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER', 'STOREKEEPER', 'BARTENDER')];
        _findAllWastage_decorators = [(0, common_1.Get)('wastage/all'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER')];
        _approveWastage_decorators = [(0, common_1.Patch)('wastage/:id/approve'), (0, common_1.UseGuards)(roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER')];
        __esDecorate(_classThis, null, _getStockSummary_decorators, { kind: "method", name: "getStockSummary", static: false, private: false, access: { has: function (obj) { return "getStockSummary" in obj; }, get: function (obj) { return obj.getStockSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCurrentStock_decorators, { kind: "method", name: "getCurrentStock", static: false, private: false, access: { has: function (obj) { return "getCurrentStock" in obj; }, get: function (obj) { return obj.getCurrentStock; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: function (obj) { return "getHistory" in obj; }, get: function (obj) { return obj.getHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAdjustment_decorators, { kind: "method", name: "createAdjustment", static: false, private: false, access: { has: function (obj) { return "createAdjustment" in obj; }, get: function (obj) { return obj.createAdjustment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllAdjustments_decorators, { kind: "method", name: "findAllAdjustments", static: false, private: false, access: { has: function (obj) { return "findAllAdjustments" in obj; }, get: function (obj) { return obj.findAllAdjustments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveAdjustment_decorators, { kind: "method", name: "approveAdjustment", static: false, private: false, access: { has: function (obj) { return "approveAdjustment" in obj; }, get: function (obj) { return obj.approveAdjustment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createWastage_decorators, { kind: "method", name: "createWastage", static: false, private: false, access: { has: function (obj) { return "createWastage" in obj; }, get: function (obj) { return obj.createWastage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllWastage_decorators, { kind: "method", name: "findAllWastage", static: false, private: false, access: { has: function (obj) { return "findAllWastage" in obj; }, get: function (obj) { return obj.findAllWastage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveWastage_decorators, { kind: "method", name: "approveWastage", static: false, private: false, access: { has: function (obj) { return "approveWastage" in obj; }, get: function (obj) { return obj.approveWastage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InventoryController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InventoryController = _classThis;
}();
exports.InventoryController = InventoryController;
