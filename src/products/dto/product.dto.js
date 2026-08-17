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
exports.UpdateProductDto = exports.CreateProductDto = void 0;
var class_validator_1 = require("class-validator");
var CreateProductDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _sku_decorators;
    var _sku_initializers = [];
    var _sku_extraInitializers = [];
    var _barcode_decorators;
    var _barcode_initializers = [];
    var _barcode_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _trackInventory_decorators;
    var _trackInventory_initializers = [];
    var _trackInventory_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProductDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.categoryId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.sku = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _sku_initializers, void 0));
                this.barcode = (__runInitializers(this, _sku_extraInitializers), __runInitializers(this, _barcode_initializers, void 0));
                this.description = (__runInitializers(this, _barcode_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.trackInventory = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _trackInventory_initializers, void 0));
                this.isActive = (__runInitializers(this, _trackInventory_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return CreateProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _categoryId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sku_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _barcode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _trackInventory_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _isActive_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _sku_decorators, { kind: "field", name: "sku", static: false, private: false, access: { has: function (obj) { return "sku" in obj; }, get: function (obj) { return obj.sku; }, set: function (obj, value) { obj.sku = value; } }, metadata: _metadata }, _sku_initializers, _sku_extraInitializers);
            __esDecorate(null, null, _barcode_decorators, { kind: "field", name: "barcode", static: false, private: false, access: { has: function (obj) { return "barcode" in obj; }, get: function (obj) { return obj.barcode; }, set: function (obj, value) { obj.barcode = value; } }, metadata: _metadata }, _barcode_initializers, _barcode_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _trackInventory_decorators, { kind: "field", name: "trackInventory", static: false, private: false, access: { has: function (obj) { return "trackInventory" in obj; }, get: function (obj) { return obj.trackInventory; }, set: function (obj, value) { obj.trackInventory = value; } }, metadata: _metadata }, _trackInventory_initializers, _trackInventory_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProductDto = CreateProductDto;
var UpdateProductDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    var _sku_decorators;
    var _sku_initializers = [];
    var _sku_extraInitializers = [];
    var _barcode_decorators;
    var _barcode_initializers = [];
    var _barcode_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _trackInventory_decorators;
    var _trackInventory_initializers = [];
    var _trackInventory_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateProductDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.categoryId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _categoryId_initializers, void 0));
                this.sku = (__runInitializers(this, _categoryId_extraInitializers), __runInitializers(this, _sku_initializers, void 0));
                this.barcode = (__runInitializers(this, _sku_extraInitializers), __runInitializers(this, _barcode_initializers, void 0));
                this.description = (__runInitializers(this, _barcode_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.trackInventory = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _trackInventory_initializers, void 0));
                this.isActive = (__runInitializers(this, _trackInventory_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return UpdateProductDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _categoryId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sku_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _barcode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _trackInventory_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _isActive_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            __esDecorate(null, null, _sku_decorators, { kind: "field", name: "sku", static: false, private: false, access: { has: function (obj) { return "sku" in obj; }, get: function (obj) { return obj.sku; }, set: function (obj, value) { obj.sku = value; } }, metadata: _metadata }, _sku_initializers, _sku_extraInitializers);
            __esDecorate(null, null, _barcode_decorators, { kind: "field", name: "barcode", static: false, private: false, access: { has: function (obj) { return "barcode" in obj; }, get: function (obj) { return obj.barcode; }, set: function (obj, value) { obj.barcode = value; } }, metadata: _metadata }, _barcode_initializers, _barcode_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _trackInventory_decorators, { kind: "field", name: "trackInventory", static: false, private: false, access: { has: function (obj) { return "trackInventory" in obj; }, get: function (obj) { return obj.trackInventory; }, set: function (obj, value) { obj.trackInventory = value; } }, metadata: _metadata }, _trackInventory_initializers, _trackInventory_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateProductDto = UpdateProductDto;
