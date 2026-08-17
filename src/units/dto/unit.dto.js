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
exports.UpdateUnitDto = exports.CreateUnitDto = void 0;
var class_validator_1 = require("class-validator");
var CreateUnitDto = function () {
    var _a;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _quantityInBaseUnit_decorators;
    var _quantityInBaseUnit_initializers = [];
    var _quantityInBaseUnit_extraInitializers = [];
    var _isPurchaseUnit_decorators;
    var _isPurchaseUnit_initializers = [];
    var _isPurchaseUnit_extraInitializers = [];
    var _isSaleUnit_decorators;
    var _isSaleUnit_initializers = [];
    var _isSaleUnit_extraInitializers = [];
    var _isBaseUnit_decorators;
    var _isBaseUnit_initializers = [];
    var _isBaseUnit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateUnitDto() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.name = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.quantityInBaseUnit = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _quantityInBaseUnit_initializers, void 0));
                this.isPurchaseUnit = (__runInitializers(this, _quantityInBaseUnit_extraInitializers), __runInitializers(this, _isPurchaseUnit_initializers, void 0));
                this.isSaleUnit = (__runInitializers(this, _isPurchaseUnit_extraInitializers), __runInitializers(this, _isSaleUnit_initializers, void 0));
                this.isBaseUnit = (__runInitializers(this, _isSaleUnit_extraInitializers), __runInitializers(this, _isBaseUnit_initializers, void 0));
                __runInitializers(this, _isBaseUnit_extraInitializers);
            }
            return CreateUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _quantityInBaseUnit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.0001)];
            _isPurchaseUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _isSaleUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _isBaseUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _quantityInBaseUnit_decorators, { kind: "field", name: "quantityInBaseUnit", static: false, private: false, access: { has: function (obj) { return "quantityInBaseUnit" in obj; }, get: function (obj) { return obj.quantityInBaseUnit; }, set: function (obj, value) { obj.quantityInBaseUnit = value; } }, metadata: _metadata }, _quantityInBaseUnit_initializers, _quantityInBaseUnit_extraInitializers);
            __esDecorate(null, null, _isPurchaseUnit_decorators, { kind: "field", name: "isPurchaseUnit", static: false, private: false, access: { has: function (obj) { return "isPurchaseUnit" in obj; }, get: function (obj) { return obj.isPurchaseUnit; }, set: function (obj, value) { obj.isPurchaseUnit = value; } }, metadata: _metadata }, _isPurchaseUnit_initializers, _isPurchaseUnit_extraInitializers);
            __esDecorate(null, null, _isSaleUnit_decorators, { kind: "field", name: "isSaleUnit", static: false, private: false, access: { has: function (obj) { return "isSaleUnit" in obj; }, get: function (obj) { return obj.isSaleUnit; }, set: function (obj, value) { obj.isSaleUnit = value; } }, metadata: _metadata }, _isSaleUnit_initializers, _isSaleUnit_extraInitializers);
            __esDecorate(null, null, _isBaseUnit_decorators, { kind: "field", name: "isBaseUnit", static: false, private: false, access: { has: function (obj) { return "isBaseUnit" in obj; }, get: function (obj) { return obj.isBaseUnit; }, set: function (obj, value) { obj.isBaseUnit = value; } }, metadata: _metadata }, _isBaseUnit_initializers, _isBaseUnit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateUnitDto = CreateUnitDto;
var UpdateUnitDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _quantityInBaseUnit_decorators;
    var _quantityInBaseUnit_initializers = [];
    var _quantityInBaseUnit_extraInitializers = [];
    var _isPurchaseUnit_decorators;
    var _isPurchaseUnit_initializers = [];
    var _isPurchaseUnit_extraInitializers = [];
    var _isSaleUnit_decorators;
    var _isSaleUnit_initializers = [];
    var _isSaleUnit_extraInitializers = [];
    var _isBaseUnit_decorators;
    var _isBaseUnit_initializers = [];
    var _isBaseUnit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateUnitDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.quantityInBaseUnit = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _quantityInBaseUnit_initializers, void 0));
                this.isPurchaseUnit = (__runInitializers(this, _quantityInBaseUnit_extraInitializers), __runInitializers(this, _isPurchaseUnit_initializers, void 0));
                this.isSaleUnit = (__runInitializers(this, _isPurchaseUnit_extraInitializers), __runInitializers(this, _isSaleUnit_initializers, void 0));
                this.isBaseUnit = (__runInitializers(this, _isSaleUnit_extraInitializers), __runInitializers(this, _isBaseUnit_initializers, void 0));
                __runInitializers(this, _isBaseUnit_extraInitializers);
            }
            return UpdateUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _quantityInBaseUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0.0001)];
            _isPurchaseUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _isSaleUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _isBaseUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _quantityInBaseUnit_decorators, { kind: "field", name: "quantityInBaseUnit", static: false, private: false, access: { has: function (obj) { return "quantityInBaseUnit" in obj; }, get: function (obj) { return obj.quantityInBaseUnit; }, set: function (obj, value) { obj.quantityInBaseUnit = value; } }, metadata: _metadata }, _quantityInBaseUnit_initializers, _quantityInBaseUnit_extraInitializers);
            __esDecorate(null, null, _isPurchaseUnit_decorators, { kind: "field", name: "isPurchaseUnit", static: false, private: false, access: { has: function (obj) { return "isPurchaseUnit" in obj; }, get: function (obj) { return obj.isPurchaseUnit; }, set: function (obj, value) { obj.isPurchaseUnit = value; } }, metadata: _metadata }, _isPurchaseUnit_initializers, _isPurchaseUnit_extraInitializers);
            __esDecorate(null, null, _isSaleUnit_decorators, { kind: "field", name: "isSaleUnit", static: false, private: false, access: { has: function (obj) { return "isSaleUnit" in obj; }, get: function (obj) { return obj.isSaleUnit; }, set: function (obj, value) { obj.isSaleUnit = value; } }, metadata: _metadata }, _isSaleUnit_initializers, _isSaleUnit_extraInitializers);
            __esDecorate(null, null, _isBaseUnit_decorators, { kind: "field", name: "isBaseUnit", static: false, private: false, access: { has: function (obj) { return "isBaseUnit" in obj; }, get: function (obj) { return obj.isBaseUnit; }, set: function (obj, value) { obj.isBaseUnit = value; } }, metadata: _metadata }, _isBaseUnit_initializers, _isBaseUnit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateUnitDto = UpdateUnitDto;
