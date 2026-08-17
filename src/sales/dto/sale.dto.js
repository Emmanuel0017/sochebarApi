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
exports.VoidSaleDto = exports.CreateSaleDto = exports.SalePaymentDto = exports.SaleItemDto = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var SaleItemDto = function () {
    var _a;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _unitId_decorators;
    var _unitId_initializers = [];
    var _unitId_extraInitializers = [];
    var _quantity_decorators;
    var _quantity_initializers = [];
    var _quantity_extraInitializers = [];
    var _unitPrice_decorators;
    var _unitPrice_initializers = [];
    var _unitPrice_extraInitializers = [];
    var _discount_decorators;
    var _discount_initializers = [];
    var _discount_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SaleItemDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.unitId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _unitId_initializers, void 0));
                this.quantity = (__runInitializers(this, _unitId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.unitPrice = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
                this.discount = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
                __runInitializers(this, _discount_extraInitializers);
            }
            return SaleItemDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _unitId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _quantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.0001)];
            _unitPrice_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _discount_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _unitId_decorators, { kind: "field", name: "unitId", static: false, private: false, access: { has: function (obj) { return "unitId" in obj; }, get: function (obj) { return obj.unitId; }, set: function (obj, value) { obj.unitId = value; } }, metadata: _metadata }, _unitId_initializers, _unitId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: function (obj) { return "unitPrice" in obj; }, get: function (obj) { return obj.unitPrice; }, set: function (obj, value) { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
            __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: function (obj) { return "discount" in obj; }, get: function (obj) { return obj.discount; }, set: function (obj, value) { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SaleItemDto = SaleItemDto;
var SalePaymentDto = function () {
    var _a;
    var _paymentMethod_decorators;
    var _paymentMethod_initializers = [];
    var _paymentMethod_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SalePaymentDto() {
                this.paymentMethod = __runInitializers(this, _paymentMethod_initializers, void 0);
                this.amount = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.reference = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
                __runInitializers(this, _reference_extraInitializers);
            }
            return SalePaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentMethod_decorators = [(0, class_validator_1.IsEnum)(client_1.PaymentMethod)];
            _amount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.01)];
            _reference_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: function (obj) { return "paymentMethod" in obj; }, get: function (obj) { return obj.paymentMethod; }, set: function (obj, value) { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SalePaymentDto = SalePaymentDto;
var CreateSaleDto = function () {
    var _a;
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _payments_decorators;
    var _payments_initializers = [];
    var _payments_extraInitializers = [];
    var _customerId_decorators;
    var _customerId_initializers = [];
    var _customerId_extraInitializers = [];
    var _discount_decorators;
    var _discount_initializers = [];
    var _discount_extraInitializers = [];
    var _tax_decorators;
    var _tax_initializers = [];
    var _tax_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSaleDto() {
                this.items = __runInitializers(this, _items_initializers, void 0);
                this.payments = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _payments_initializers, void 0));
                this.customerId = (__runInitializers(this, _payments_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.discount = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
                this.tax = (__runInitializers(this, _discount_extraInitializers), __runInitializers(this, _tax_initializers, void 0));
                __runInitializers(this, _tax_extraInitializers);
            }
            return CreateSaleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _items_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMinSize)(1), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SaleItemDto; })];
            _payments_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return SalePaymentDto; })];
            _customerId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _discount_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _tax_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _payments_decorators, { kind: "field", name: "payments", static: false, private: false, access: { has: function (obj) { return "payments" in obj; }, get: function (obj) { return obj.payments; }, set: function (obj, value) { obj.payments = value; } }, metadata: _metadata }, _payments_initializers, _payments_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: function (obj) { return "customerId" in obj; }, get: function (obj) { return obj.customerId; }, set: function (obj, value) { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: function (obj) { return "discount" in obj; }, get: function (obj) { return obj.discount; }, set: function (obj, value) { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
            __esDecorate(null, null, _tax_decorators, { kind: "field", name: "tax", static: false, private: false, access: { has: function (obj) { return "tax" in obj; }, get: function (obj) { return obj.tax; }, set: function (obj, value) { obj.tax = value; } }, metadata: _metadata }, _tax_initializers, _tax_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSaleDto = CreateSaleDto;
var VoidSaleDto = function () {
    var _a;
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VoidSaleDto() {
                this.reason = __runInitializers(this, _reason_initializers, void 0);
                __runInitializers(this, _reason_extraInitializers);
            }
            return VoidSaleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reason_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VoidSaleDto = VoidSaleDto;
