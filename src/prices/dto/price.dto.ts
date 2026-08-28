import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PriceType } from '@prisma/client';

export class CreatePriceDto {
  @IsString() @IsNotEmpty() unitId: string;
  @IsNumber() @Min(0) price: number;
  @IsOptional() @IsEnum(PriceType) priceType?: PriceType;
}

export class UpdatePriceDto {
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsString() effectiveTo?: string;
}
