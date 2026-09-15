import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';
import { SyncOutboxInterceptor } from './common/interceptors/sync-outbox.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UnitsModule } from './units/units.module';
import { PricesModule } from './prices/prices.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { CashModule } from './cash/cash.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CustomersModule } from './customers/customers.module';
import { AuditModule } from './audit/audit.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { EmptyBottlesModule } from './empty-bottles/empty-bottles.module';
import { ExportsModule } from './exports/exports.module';
import { AccountsModule } from './accounts/accounts.module';
import { HealthModule } from './health/health.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    CategoriesModule,
    ProductsModule,
    UnitsModule,
    PricesModule,
    SuppliersModule,
    PurchasesModule,
    InventoryModule,
    SalesModule,
    CashModule,
    ExpensesModule,
    CustomersModule,
    AuditModule,
    DashboardModule,
    ReportsModule,
    EmptyBottlesModule,
    ExportsModule,
    AccountsModule,
    SyncModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SyncOutboxInterceptor,
    },
  ],
})
export class AppModule {}
