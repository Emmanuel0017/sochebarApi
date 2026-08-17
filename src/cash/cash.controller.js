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
exports.CashController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
var CashController = function () {
    var _classDecorators = [(0, common_1.Controller)('cash'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _open_decorators;
    var _current_decorators;
    var _close_decorators;
    var _transactions_decorators;
    var _addTransaction_decorators;
    var CashController = _classThis = /** @class */ (function () {
        function CashController_1(cashService) {
            this.cashService = (__runInitializers(this, _instanceExtraInitializers), cashService);
        }
        CashController_1.prototype.open = function (dto, user) {
            return this.cashService.openSession(user.id, dto);
        };
        CashController_1.prototype.current = function (user) {
            return this.cashService.getCurrentSession(user.id);
        };
        CashController_1.prototype.close = function (id, dto, user) {
            return this.cashService.closeSession(id, dto, user.id);
        };
        CashController_1.prototype.transactions = function (id) {
            return this.cashService.getTransactions(id);
        };
        CashController_1.prototype.addTransaction = function (id, dto, user) {
            return this.cashService.recordTransaction(id, dto, user.id);
        };
        return CashController_1;
    }());
    __setFunctionName(_classThis, "CashController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _open_decorators = [(0, common_1.Post)('sessions/open')];
        _current_decorators = [(0, common_1.Get)('sessions/current')];
        _close_decorators = [(0, common_1.Post)('sessions/:id/close')];
        _transactions_decorators = [(0, common_1.Get)('sessions/:id/transactions')];
        _addTransaction_decorators = [(0, common_1.Post)('sessions/:id/transactions')];
        __esDecorate(_classThis, null, _open_decorators, { kind: "method", name: "open", static: false, private: false, access: { has: function (obj) { return "open" in obj; }, get: function (obj) { return obj.open; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _current_decorators, { kind: "method", name: "current", static: false, private: false, access: { has: function (obj) { return "current" in obj; }, get: function (obj) { return obj.current; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _close_decorators, { kind: "method", name: "close", static: false, private: false, access: { has: function (obj) { return "close" in obj; }, get: function (obj) { return obj.close; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transactions_decorators, { kind: "method", name: "transactions", static: false, private: false, access: { has: function (obj) { return "transactions" in obj; }, get: function (obj) { return obj.transactions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addTransaction_decorators, { kind: "method", name: "addTransaction", static: false, private: false, access: { has: function (obj) { return "addTransaction" in obj; }, get: function (obj) { return obj.addTransaction; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CashController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CashController = _classThis;
}();
exports.CashController = CashController;
