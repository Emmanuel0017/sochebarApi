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

export class SaleItemDto {
  @IsString() @IsNotEmpty() productId!: string;
  @IsString() @IsNotEmpty() unitId!: string;
  @IsNumber() @Min(0.0001) quantity!: number;
  @IsNumber() @Min(0) unitPrice!: number;
  @IsOptional() @IsNumber() @Min(0) discount?: number;
}

export class SalePaymentDto {
  @IsEnum(PaymentMethod) paymentMethod!: PaymentMethod;
  @IsNumber() @Min(0.01) amount!: number;
  @IsOptional() @IsString() reference?: string;
}

export class CreateSaleDto {
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => SaleItemDto)
  items!: SaleItemDto[];

  @IsArray() @ValidateNested({ each: true }) @Type(() => SalePaymentDto)
  payments!: SalePaymentDto[];

  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @IsOptional() @IsNumber() @Min(0) tax?: number;
}

export class VoidSaleDto {
  @IsString() @IsNotEmpty() reason!: string;
}
