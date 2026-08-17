import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class PurchaseItemDto {
  @IsString() @IsNotEmpty() productId!: string;
  @IsString() @IsNotEmpty() unitId!: string;
  @IsNumber() @Min(0.0001) quantity!: number;
  @IsNumber() @Min(0) unitCost!: number;
}

export class CreatePurchaseDto {
  @IsString() @IsNotEmpty() supplierId!: string;
  @IsOptional() @IsString() invoiceNumber?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => PurchaseItemDto)
  items!: PurchaseItemDto[];
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @IsOptional() @IsNumber() @Min(0) tax?: number;
  @IsOptional() @IsString() notes?: string;
  // If the purchase is paid immediately (fully or partially) at receipt time.
  @IsOptional() @IsNumber() @Min(0) amountPaidNow?: number;
  @IsOptional() @IsEnum(PaymentMethod) paymentMethod?: PaymentMethod;
}
