/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsArray,
  Matches,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RoleFullBodyReqDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  hasPublished?: boolean;

  @IsBoolean()
  @IsOptional()
  hasSoftDeleted?: boolean;
}

export class FindManyRoleQueryReq {
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  page: number;

  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;
}

export class PrimaryKeysRoleDto {
  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class MultiplePrimaryKeysRoleDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(2, { message: 'At least two permission keys are required' })
  @Type(() => PrimaryKeysRoleDto)
  items: PrimaryKeysRoleDto[];
}
export class CreateRoleBodyReqDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;
}

export class UpdateRoleBodyReqDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty()
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  hasPublished?: boolean;
}
export class DeleteRoleBodyReqDto {
  @IsBoolean()
  @IsOptional()
  hasSoftDeleted?: boolean;
}

export class UpdateRolePermissionBodyReqDto {
  @IsArray()
  @IsOptional()
  @ApiProperty()
  connect?: string[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  disconnect?: string[];
}
