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
exports.UpdatePriceDto = exports.CreatePriceDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var CreatePriceDto = function () {
    var _a;
    var _unitId_decorators;
    var _unitId_initializers = [];
    var _unitId_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _priceType_decorators;
    var _priceType_initializers = [];
    var _priceType_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePriceDto() {
                this.unitId = __runInitializers(this, _unitId_initializers, void 0);
                this.price = (__runInitializers(this, _unitId_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.priceType = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _priceType_initializers, void 0));
                __runInitializers(this, _priceType_extraInitializers);
            }
            return CreatePriceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unitId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _price_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _priceType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.PriceType)];
            __esDecorate(null, null, _unitId_decorators, { kind: "field", name: "unitId", static: false, private: false, access: { has: function (obj) { return "unitId" in obj; }, get: function (obj) { return obj.unitId; }, set: function (obj, value) { obj.unitId = value; } }, metadata: _metadata }, _unitId_initializers, _unitId_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _priceType_decorators, { kind: "field", name: "priceType", static: false, private: false, access: { has: function (obj) { return "priceType" in obj; }, get: function (obj) { return obj.priceType; }, set: function (obj, value) { obj.priceType = value; } }, metadata: _metadata }, _priceType_initializers, _priceType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePriceDto = CreatePriceDto;
var UpdatePriceDto = function () {
    var _a;
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _effectiveTo_decorators;
    var _effectiveTo_initializers = [];
    var _effectiveTo_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePriceDto() {
                this.price = __runInitializers(this, _price_initializers, void 0);
                this.effectiveTo = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _effectiveTo_initializers, void 0));
                __runInitializers(this, _effectiveTo_extraInitializers);
            }
            return UpdatePriceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _price_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _effectiveTo_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _effectiveTo_decorators, { kind: "field", name: "effectiveTo", static: false, private: false, access: { has: function (obj) { return "effectiveTo" in obj; }, get: function (obj) { return obj.effectiveTo; }, set: function (obj, value) { obj.effectiveTo = value; } }, metadata: _metadata }, _effectiveTo_initializers, _effectiveTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePriceDto = UpdatePriceDto;
