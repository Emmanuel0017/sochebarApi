import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { InventoryModule } from '../inventory/inventory.module';
import { CashModule } from '../cash/cash.module';
import { CustomersModule } from '../customers/customers.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [InventoryModule, CashModule, CustomersModule, AuditModule],
  providers: [SalesService],
  controllers: [SalesController],
  exports: [SalesService],
})
export class SalesModule {}
