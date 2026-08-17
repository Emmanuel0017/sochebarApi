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
exports.CreateWastageDto = exports.CreateStockAdjustmentDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var CreateStockAdjustmentDto = function () {
    var _a;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _unitId_decorators;
    var _unitId_initializers = [];
    var _unitId_extraInitializers = [];
    var _physicalQuantity_decorators;
    var _physicalQuantity_initializers = [];
    var _physicalQuantity_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateStockAdjustmentDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.unitId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _unitId_initializers, void 0));
                this.physicalQuantity = (__runInitializers(this, _unitId_extraInitializers), __runInitializers(this, _physicalQuantity_initializers, void 0)); // in the given unit
                this.reason = (__runInitializers(this, _physicalQuantity_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.notes = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreateStockAdjustmentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _unitId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _physicalQuantity_decorators = [(0, class_validator_1.IsNumber)()];
            _reason_decorators = [(0, class_validator_1.IsEnum)(client_1.StockAdjustmentReason)];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _unitId_decorators, { kind: "field", name: "unitId", static: false, private: false, access: { has: function (obj) { return "unitId" in obj; }, get: function (obj) { return obj.unitId; }, set: function (obj, value) { obj.unitId = value; } }, metadata: _metadata }, _unitId_initializers, _unitId_extraInitializers);
            __esDecorate(null, null, _physicalQuantity_decorators, { kind: "field", name: "physicalQuantity", static: false, private: false, access: { has: function (obj) { return "physicalQuantity" in obj; }, get: function (obj) { return obj.physicalQuantity; }, set: function (obj, value) { obj.physicalQuantity = value; } }, metadata: _metadata }, _physicalQuantity_initializers, _physicalQuantity_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateStockAdjustmentDto = CreateStockAdjustmentDto;
var CreateWastageDto = function () {
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
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateWastageDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.unitId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _unitId_initializers, void 0));
                this.quantity = (__runInitializers(this, _unitId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0)); // in the given unit
                this.reason = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.description = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return CreateWastageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _unitId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _quantity_decorators = [(0, class_validator_1.IsNumber)()];
            _reason_decorators = [(0, class_validator_1.IsEnum)(client_1.WastageReason)];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _unitId_decorators, { kind: "field", name: "unitId", static: false, private: false, access: { has: function (obj) { return "unitId" in obj; }, get: function (obj) { return obj.unitId; }, set: function (obj, value) { obj.unitId = value; } }, metadata: _metadata }, _unitId_initializers, _unitId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateWastageDto = CreateWastageDto;
