import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateExpenseDto {
  @IsString() @IsNotEmpty() categoryId: string;
  @IsString() @IsNotEmpty() description: string;
  @IsNumber() @Min(0.01) amount: number;
  @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() cashSessionId?: string; // required if paymentMethod === CASH
}

export class UpdateExpenseDto {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() @Min(0.01) amount?: number;
  @IsOptional() @IsString() reference?: string;
}

export class CreateExpenseCategoryDto {
  @IsString() @IsNotEmpty() name: string;
  @IsOptional() @IsString() description?: string;
}
