import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { StockAdjustmentsService } from './stock-adjustments.service';
import { WastageService } from './wastage.service';
import { InventoryController } from './inventory.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [InventoryService, StockAdjustmentsService, WastageService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
