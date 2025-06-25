import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsBoolean,
  IsOptional,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserBodyReqDto<T> {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty()
  roles: T[];
}

export class UserBodyUpdateReqDto<T> {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  @ApiProperty()
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  @ApiProperty()
  lastName?: string;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  @ApiProperty()
  roles?: T[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  hasSoftDeleted?: boolean;
}

export class PrimaryKeysUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class MultiplePrimaryKeysUserDto {
  @ValidateNested({ each: true })
  @Type(() => PrimaryKeysUserDto)
  items: PrimaryKeysUserDto[];
}
export class UserWhereDto {
  id?: string;
  email?: string;
}

export class DeleteUserBodyReqDto {
  @IsBoolean()
  @IsOptional()
  hasSoftDeleted?: boolean;
}
