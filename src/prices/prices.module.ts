import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController, PricesUpdateController } from './prices.controller';

@Module({
  providers: [PricesService],
  controllers: [PricesController, PricesUpdateController],
  exports: [PricesService],
})
export class PricesModule {}
