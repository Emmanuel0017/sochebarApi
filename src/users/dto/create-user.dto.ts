import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() username: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() @MinLength(6) password: string;
  @IsString() @IsNotEmpty() roleId: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
