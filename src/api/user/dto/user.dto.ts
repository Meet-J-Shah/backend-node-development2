import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class UserParamReqDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
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
