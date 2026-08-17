import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateUnitDto {
  @IsString() @IsNotEmpty() productId!: string;
  @IsString() @IsNotEmpty() name!: string;
  @IsNumber() @Min(0.0001) quantityInBaseUnit!: number;
  @IsOptional() @IsBoolean() isPurchaseUnit?: boolean;
  @IsOptional() @IsBoolean() isSaleUnit?: boolean;
  @IsOptional() @IsBoolean() isBaseUnit?: boolean;
}

export class UpdateUnitDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() @Min(0.0001) quantityInBaseUnit?: number;
  @IsOptional() @IsBoolean() isPurchaseUnit?: boolean;
  @IsOptional() @IsBoolean() isSaleUnit?: boolean;
  @IsOptional() @IsBoolean() isBaseUnit?: boolean;
}
