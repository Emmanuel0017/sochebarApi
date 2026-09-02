import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CapitalTransactionType, CashAccountType, CashAccountTransactionType } from '@prisma/client';

// ---- Partners / Capital accounts ----
export class CreatePartnerDto {
  @IsString() @IsNotEmpty() name: string;
}

export class CreateCapitalTransactionDto {
  @IsString() @IsNotEmpty() partnerId: string;
  @IsEnum(CapitalTransactionType) transactionType: CapitalTransactionType;
  @IsString() @IsNotEmpty() description: string;
  @IsNumber() @Min(0.01) amount: number;
  // Portion of `amount` that was specifically stock/inventory purchases, as
  // opposed to rent, fuel, fixtures, deposits, etc. Matches the extra
  // column on the paper capital account sheet. Optional - leave it out when
  // the whole amount is non-stock, or the split isn't known.
  @IsOptional() @IsNumber() @Min(0) stockValue?: number;
  @IsOptional() @IsString() transactionDate?: string;
}

// ---- Fixed assets ----
export class CreateFixedAssetDto {
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() @Min(0) cost: number;
  @IsOptional() @IsString() acquiredDate?: string;
  @IsOptional() @IsString() notes?: string;
}

// ---- Cash accounts (Bank / Mobile Money / Petty Cash) ----
export class CreateCashAccountDto {
  @IsString() @IsNotEmpty() name: string;
  @IsEnum(CashAccountType) type: CashAccountType;
}

export class CreateCashAccountTransactionDto {
  @IsString() @IsNotEmpty() cashAccountId: string;
  @IsEnum(CashAccountTransactionType) transactionType: CashAccountTransactionType;
  @IsNumber() amount: number; // signed: positive = in, negative = out
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() transactionDate?: string;
}

// Convenience: move money between two cash accounts (e.g. "banked cash" -
// petty cash -> Bank) in one call instead of two opposite transactions.
export class TransferCashDto {
  @IsString() @IsNotEmpty() fromCashAccountId: string;
  @IsString() @IsNotEmpty() toCashAccountId: string;
  @IsNumber() @Min(0.01) amount: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() transactionDate?: string;
}
