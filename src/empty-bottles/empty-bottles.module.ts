import { Module } from '@nestjs/common';
import { EmptyBottlesService } from './empty-bottles.service';
import { EmptyBottlesController } from './empty-bottles.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [EmptyBottlesService],
  controllers: [EmptyBottlesController],
  exports: [EmptyBottlesService],
})
export class EmptyBottlesModule {}
