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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var ReportsController = function () {
    var _classDecorators = [(0, common_1.Controller)('reports'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Roles)('ADMIN', 'MANAGER')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _dailySales_decorators;
    var _productSales_decorators;
    var _inventory_decorators;
    var _purchases_decorators;
    var _expenses_decorators;
    var _cash_decorators;
    var _profit_decorators;
    var _customerCredit_decorators;
    var _supplierCredit_decorators;
    var ReportsController = _classThis = /** @class */ (function () {
        function ReportsController_1(reportsService) {
            this.reportsService = (__runInitializers(this, _instanceExtraInitializers), reportsService);
        }
        ReportsController_1.prototype.dailySales = function (date) {
            return this.reportsService.dailySales(date !== null && date !== void 0 ? date : new Date().toISOString().slice(0, 10));
        };
        ReportsController_1.prototype.productSales = function (from, to) {
            return this.reportsService.productSales(from, to);
        };
        ReportsController_1.prototype.inventory = function (productId) {
            return this.reportsService.inventory(productId);
        };
        ReportsController_1.prototype.purchases = function (from, to) {
            return this.reportsService.purchases(from, to);
        };
        ReportsController_1.prototype.expenses = function (from, to) {
            return this.reportsService.expenses(from, to);
        };
        ReportsController_1.prototype.cash = function (sessionId) {
            return this.reportsService.cash(sessionId);
        };
        ReportsController_1.prototype.profit = function (from, to) {
            return this.reportsService.profit(from, to);
        };
        ReportsController_1.prototype.customerCredit = function () {
            return this.reportsService.customerCredit();
        };
        ReportsController_1.prototype.supplierCredit = function () {
            return this.reportsService.supplierDebt();
        };
        return ReportsController_1;
    }());
    __setFunctionName(_classThis, "ReportsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _dailySales_decorators = [(0, common_1.Get)('daily-sales')];
        _productSales_decorators = [(0, common_1.Get)('sales')];
        _inventory_decorators = [(0, common_1.Get)('inventory')];
        _purchases_decorators = [(0, common_1.Get)('purchases')];
        _expenses_decorators = [(0, common_1.Get)('expenses')];
        _cash_decorators = [(0, common_1.Get)('cash')];
        _profit_decorators = [(0, common_1.Get)('profit')];
        _customerCredit_decorators = [(0, common_1.Get)('customer-credit')];
        _supplierCredit_decorators = [(0, common_1.Get)('supplier-credit')];
        __esDecorate(_classThis, null, _dailySales_decorators, { kind: "method", name: "dailySales", static: false, private: false, access: { has: function (obj) { return "dailySales" in obj; }, get: function (obj) { return obj.dailySales; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _productSales_decorators, { kind: "method", name: "productSales", static: false, private: false, access: { has: function (obj) { return "productSales" in obj; }, get: function (obj) { return obj.productSales; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _inventory_decorators, { kind: "method", name: "inventory", static: false, private: false, access: { has: function (obj) { return "inventory" in obj; }, get: function (obj) { return obj.inventory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _purchases_decorators, { kind: "method", name: "purchases", static: false, private: false, access: { has: function (obj) { return "purchases" in obj; }, get: function (obj) { return obj.purchases; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _expenses_decorators, { kind: "method", name: "expenses", static: false, private: false, access: { has: function (obj) { return "expenses" in obj; }, get: function (obj) { return obj.expenses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cash_decorators, { kind: "method", name: "cash", static: false, private: false, access: { has: function (obj) { return "cash" in obj; }, get: function (obj) { return obj.cash; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _profit_decorators, { kind: "method", name: "profit", static: false, private: false, access: { has: function (obj) { return "profit" in obj; }, get: function (obj) { return obj.profit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _customerCredit_decorators, { kind: "method", name: "customerCredit", static: false, private: false, access: { has: function (obj) { return "customerCredit" in obj; }, get: function (obj) { return obj.customerCredit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _supplierCredit_decorators, { kind: "method", name: "supplierCredit", static: false, private: false, access: { has: function (obj) { return "supplierCredit" in obj; }, get: function (obj) { return obj.supplierCredit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsController = _classThis;
}();
exports.ReportsController = ReportsController;
