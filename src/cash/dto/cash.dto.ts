import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CashTransactionType } from '@prisma/client';

export class OpenSessionDto {
  @IsNumber() @Min(0) openingCash!: number;
}

export class CloseSessionDto {
  @IsNumber() @Min(0) actualCash!: number;
}

export class CreateCashTransactionDto {
  @IsEnum(CashTransactionType) transactionType!: CashTransactionType;
  @IsNumber() amount!: number;
  @IsOptional() @IsString() description?: string;
}
