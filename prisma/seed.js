"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require("bcrypt");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var roleNames, roles, _i, roleNames_1, name_1, role, adminPasswordHash, categoryNames, categories, _a, categoryNames_1, name_2, cat, expenseCategoryNames, _b, expenseCategoryNames_1, name_3, existing, product, bottleUnit, adminUser;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    roleNames = ['ADMIN', 'MANAGER', 'CASHIER', 'BARTENDER', 'STOREKEEPER'];
                    roles = {};
                    _i = 0, roleNames_1 = roleNames;
                    _c.label = 1;
                case 1:
                    if (!(_i < roleNames_1.length)) return [3 /*break*/, 4];
                    name_1 = roleNames_1[_i];
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: name_1 },
                            update: {},
                            create: { name: name_1, description: "".concat(name_1, " role") },
                        })];
                case 2:
                    role = _c.sent();
                    roles[name_1] = role.id;
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, bcrypt.hash('ChangeMe123!', 10)];
                case 5:
                    adminPasswordHash = _c.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { username: 'admin' },
                            update: {},
                            create: {
                                name: 'System Administrator',
                                username: 'admin',
                                email: 'admin@bar.local',
                                passwordHash: adminPasswordHash,
                                roleId: roles.ADMIN,
                                isActive: true,
                            },
                        })];
                case 6:
                    _c.sent();
                    categoryNames = ['Beer', 'Soft Drinks', 'Spirits', 'Water', 'Wine', 'Energy Drinks', 'Juices', 'Other'];
                    categories = {};
                    _a = 0, categoryNames_1 = categoryNames;
                    _c.label = 7;
                case 7:
                    if (!(_a < categoryNames_1.length)) return [3 /*break*/, 10];
                    name_2 = categoryNames_1[_a];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { name: name_2 },
                            update: {},
                            create: { name: name_2 },
                        })];
                case 8:
                    cat = _c.sent();
                    categories[name_2] = cat.id;
                    _c.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10:
                    expenseCategoryNames = [
                        'Electricity',
                        'Water',
                        'Transport',
                        'Salaries',
                        'Cleaning',
                        'Security',
                        'Maintenance',
                        'Entertainment',
                        'Licensing',
                        'Other',
                    ];
                    _b = 0, expenseCategoryNames_1 = expenseCategoryNames;
                    _c.label = 11;
                case 11:
                    if (!(_b < expenseCategoryNames_1.length)) return [3 /*break*/, 14];
                    name_3 = expenseCategoryNames_1[_b];
                    return [4 /*yield*/, prisma.expenseCategory.upsert({ where: { name: name_3 }, update: {}, create: { name: name_3 } })];
                case 12:
                    _c.sent();
                    _c.label = 13;
                case 13:
                    _b++;
                    return [3 /*break*/, 11];
                case 14: return [4 /*yield*/, prisma.product.findFirst({ where: { name: 'Carlsberg 330ml' } })];
                case 15:
                    existing = _c.sent();
                    if (!!existing) return [3 /*break*/, 21];
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                name: 'Carlsberg 330ml',
                                categoryId: categories.Beer,
                                sku: 'BEER-CAR-330',
                            },
                        })];
                case 16:
                    product = _c.sent();
                    return [4 /*yield*/, prisma.productUnit.create({
                            data: {
                                productId: product.id,
                                name: 'Bottle',
                                quantityInBaseUnit: 1,
                                isBaseUnit: true,
                                isSaleUnit: true,
                            },
                        })];
                case 17:
                    bottleUnit = _c.sent();
                    return [4 /*yield*/, prisma.productUnit.create({
                            data: {
                                productId: product.id,
                                name: 'Case',
                                quantityInBaseUnit: 24,
                                isPurchaseUnit: true,
                            },
                        })];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, prisma.user.findUniqueOrThrow({ where: { username: 'admin' } })];
                case 19:
                    adminUser = _c.sent();
                    return [4 /*yield*/, prisma.productPrice.create({
                            data: {
                                productId: product.id,
                                unitId: bottleUnit.id,
                                price: 1500,
                                priceType: 'NORMAL',
                                createdById: adminUser.id,
                            },
                        })];
                case 20:
                    _c.sent();
                    _c.label = 21;
                case 21:
                    console.log('Seed complete. Login with username "admin" / password "ChangeMe123!" (change it immediately).');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
