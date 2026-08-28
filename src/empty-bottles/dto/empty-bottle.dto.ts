import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmptyBottleTransactionType } from '@prisma/client';

export class RecordEmptyBottleDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsEnum(EmptyBottleTransactionType) transactionType: EmptyBottleTransactionType;
  // Positive for COLLECTED/RETURNED_TO_SUPPLIER/BROKEN (direction is implied
  // by the type). For ADJUSTMENT, this is the signed delta from a recount -
  // it may be negative.
  @IsInt() quantity: number;
  @IsOptional() @IsString() notes?: string;
}
