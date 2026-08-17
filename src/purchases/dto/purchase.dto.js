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
exports.CreatePurchaseDto = exports.PurchaseItemDto = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var PurchaseItemDto = function () {
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
    var _unitCost_decorators;
    var _unitCost_initializers = [];
    var _unitCost_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PurchaseItemDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.unitId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _unitId_initializers, void 0));
                this.quantity = (__runInitializers(this, _unitId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.unitCost = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitCost_initializers, void 0));
                __runInitializers(this, _unitCost_extraInitializers);
            }
            return PurchaseItemDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _unitId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _quantity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.0001)];
            _unitCost_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _unitId_decorators, { kind: "field", name: "unitId", static: false, private: false, access: { has: function (obj) { return "unitId" in obj; }, get: function (obj) { return obj.unitId; }, set: function (obj, value) { obj.unitId = value; } }, metadata: _metadata }, _unitId_initializers, _unitId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _unitCost_decorators, { kind: "field", name: "unitCost", static: false, private: false, access: { has: function (obj) { return "unitCost" in obj; }, get: function (obj) { return obj.unitCost; }, set: function (obj, value) { obj.unitCost = value; } }, metadata: _metadata }, _unitCost_initializers, _unitCost_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PurchaseItemDto = PurchaseItemDto;
var CreatePurchaseDto = function () {
    var _a;
    var _supplierId_decorators;
    var _supplierId_initializers = [];
    var _supplierId_extraInitializers = [];
    var _invoiceNumber_decorators;
    var _invoiceNumber_initializers = [];
    var _invoiceNumber_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _discount_decorators;
    var _discount_initializers = [];
    var _discount_extraInitializers = [];
    var _tax_decorators;
    var _tax_initializers = [];
    var _tax_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _amountPaidNow_decorators;
    var _amountPaidNow_initializers = [];
    var _amountPaidNow_extraInitializers = [];
    var _paymentMethod_decorators;
    var _paymentMethod_initializers = [];
    var _paymentMethod_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePurchaseDto() {
                this.supplierId = __runInitializers(this, _supplierId_initializers, void 0);
                this.invoiceNumber = (__runInitializers(this, _supplierId_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
                this.items = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.discount = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
                this.tax = (__runInitializers(this, _discount_extraInitializers), __runInitializers(this, _tax_initializers, void 0));
                this.notes = (__runInitializers(this, _tax_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                // If the purchase is paid immediately (fully or partially) at receipt time.
                this.amountPaidNow = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _amountPaidNow_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _amountPaidNow_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                __runInitializers(this, _paymentMethod_extraInitializers);
            }
            return CreatePurchaseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _supplierId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _invoiceNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _items_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ArrayMinSize)(1), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return PurchaseItemDto; })];
            _discount_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _tax_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _amountPaidNow_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _paymentMethod_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.PaymentMethod)];
            __esDecorate(null, null, _supplierId_decorators, { kind: "field", name: "supplierId", static: false, private: false, access: { has: function (obj) { return "supplierId" in obj; }, get: function (obj) { return obj.supplierId; }, set: function (obj, value) { obj.supplierId = value; } }, metadata: _metadata }, _supplierId_initializers, _supplierId_extraInitializers);
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: function (obj) { return "invoiceNumber" in obj; }, get: function (obj) { return obj.invoiceNumber; }, set: function (obj, value) { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: function (obj) { return "discount" in obj; }, get: function (obj) { return obj.discount; }, set: function (obj, value) { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
            __esDecorate(null, null, _tax_decorators, { kind: "field", name: "tax", static: false, private: false, access: { has: function (obj) { return "tax" in obj; }, get: function (obj) { return obj.tax; }, set: function (obj, value) { obj.tax = value; } }, metadata: _metadata }, _tax_initializers, _tax_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _amountPaidNow_decorators, { kind: "field", name: "amountPaidNow", static: false, private: false, access: { has: function (obj) { return "amountPaidNow" in obj; }, get: function (obj) { return obj.amountPaidNow; }, set: function (obj, value) { obj.amountPaidNow = value; } }, metadata: _metadata }, _amountPaidNow_initializers, _amountPaidNow_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: function (obj) { return "paymentMethod" in obj; }, get: function (obj) { return obj.paymentMethod; }, set: function (obj, value) { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePurchaseDto = CreatePurchaseDto;
