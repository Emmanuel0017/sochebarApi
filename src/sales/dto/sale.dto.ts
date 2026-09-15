import { Type } from 'class-transformer';
import {
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
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() unitId: string;
  @IsNumber() @Min(0.0001) quantity: number;
  @IsNumber() @Min(0) unitPrice: number;
  @IsOptional() @IsNumber() @Min(0) discount?: number;
}

export class SalePaymentDto {
  @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;
  @IsNumber() @Min(0.01) amount: number;
  @IsOptional() @IsString() reference?: string;

  // Which customer this line is credited to. Required when paymentMethod is
  // CREDIT (falls back to the sale-level customerId below for older
  // clients). Each payment line has its own customerId, so a single sale can
  // carry several CREDIT lines against DIFFERENT customers at once - e.g.
  // splitting one bill across two people's tabs.
  @IsOptional() @IsString() customerId?: string;

  // Optional free-text note for this specific payment line, shown alongside
  // it in the customer's bill/payment history.
  @IsOptional() @IsString() comment?: string;
}

export class CreateSaleDto {
  // Optional and may be empty: a "bill" recorded directly against a customer
  // (e.g. an informal running tab) doesn't have to itemize products - see
  // manualTotal below. When items ARE given, they behave exactly like a POS
  // sale: stock is validated and decremented per line.
  @IsOptional() @IsString() clientSaleId?: string;
  
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SaleItemDto)
  items?: SaleItemDto[];

  @IsArray() @ValidateNested({ each: true }) @Type(() => SalePaymentDto)
  payments: SalePaymentDto[];

  @IsOptional() @IsString() customerId?: string;
  @IsOptional() @IsNumber() @Min(0) discount?: number;
  @IsOptional() @IsNumber() @Min(0) tax?: number;

  // Required only when items is empty/omitted - the flat amount of a
  // freeform bill with no itemized products (no inventory effect).
  @IsOptional() @IsNumber() @Min(0.01) manualTotal?: number;

  @IsOptional() @IsString() notes?: string;

  // For recording a past sale (e.g. catching up on a day that wasn't
  // entered at the time). Date-only string, e.g. "2026-08-15". Defaults to
  // now when omitted.
  @IsOptional() @IsString() saleDate?: string;
}

export class VoidSaleDto {
  @IsString() @IsNotEmpty() reason: string;
}
