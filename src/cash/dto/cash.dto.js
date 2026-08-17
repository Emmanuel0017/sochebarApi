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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCashTransactionDto = exports.CloseSessionDto = exports.OpenSessionDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var OpenSessionDto = function () {
    var _a;
    var _openingCash_decorators;
    var _openingCash_initializers = [];
    var _openingCash_extraInitializers = [];
    return _a = /** @class */ (function () {
            function OpenSessionDto() {
                this.openingCash = __runInitializers(this, _openingCash_initializers, void 0);
                __runInitializers(this, _openingCash_extraInitializers);
            }
            return OpenSessionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _openingCash_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _openingCash_decorators, { kind: "field", name: "openingCash", static: false, private: false, access: { has: function (obj) { return "openingCash" in obj; }, get: function (obj) { return obj.openingCash; }, set: function (obj, value) { obj.openingCash = value; } }, metadata: _metadata }, _openingCash_initializers, _openingCash_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.OpenSessionDto = OpenSessionDto;
var CloseSessionDto = function () {
    var _a;
    var _actualCash_decorators;
    var _actualCash_initializers = [];
    var _actualCash_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CloseSessionDto() {
                this.actualCash = __runInitializers(this, _actualCash_initializers, void 0);
                __runInitializers(this, _actualCash_extraInitializers);
            }
            return CloseSessionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _actualCash_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _actualCash_decorators, { kind: "field", name: "actualCash", static: false, private: false, access: { has: function (obj) { return "actualCash" in obj; }, get: function (obj) { return obj.actualCash; }, set: function (obj, value) { obj.actualCash = value; } }, metadata: _metadata }, _actualCash_initializers, _actualCash_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CloseSessionDto = CloseSessionDto;
var CreateCashTransactionDto = function () {
    var _a;
    var _transactionType_decorators;
    var _transactionType_initializers = [];
    var _transactionType_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateCashTransactionDto() {
                this.transactionType = __runInitializers(this, _transactionType_initializers, void 0);
                this.amount = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.description = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return CreateCashTransactionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _transactionType_decorators = [(0, class_validator_1.IsEnum)(client_1.CashTransactionType)];
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: function (obj) { return "transactionType" in obj; }, get: function (obj) { return obj.transactionType; }, set: function (obj, value) { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateCashTransactionDto = CreateCashTransactionDto;
