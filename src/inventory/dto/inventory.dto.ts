import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { StockAdjustmentReason, WastageReason } from '@prisma/client';

export class CreateStockAdjustmentDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() unitId: string;
  @IsNumber() physicalQuantity: number; // in the given unit
  @IsEnum(StockAdjustmentReason) reason: StockAdjustmentReason;
  @IsOptional() @IsString() notes?: string;
}

export class CreateWastageDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() unitId: string;
  @IsNumber() quantity: number; // in the given unit
  @IsEnum(WastageReason) reason: WastageReason;
  @IsOptional() @IsString() description?: string;
}
