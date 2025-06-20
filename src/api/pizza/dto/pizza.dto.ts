/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsInt,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
export class PizzaFullBodyReqDto {
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

export class FindManyPizzaQueryReq {
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  page: number;

  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;
}

export class FindOnePizzaParamReqDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreatePizzaBodyReqDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsInt()
  age: number;

  @IsString()
  @IsIn(['SMALL', 'MEDIUM', 'LARGE'])
  size: 'SMALL' | 'MEDIUM' | 'LARGE';

  @IsString()
  @IsOptional()
  @IsIn(['LOW', 'MILD', 'HIGH'])
  spice?: 'LOW' | 'MILD' | 'HIGH';

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedRoleIds?: string[];

  @IsOptional()
  @IsString()
  createdByRoleId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  PizzapermissionIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedRoleIds?: string[];

  @IsOptional()
  @IsString()
  lastEditedById?: string;
}

export class UpdatePizzaBodyReqDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  spice?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedRoleIds?: string[];

  @IsOptional()
  @IsString()
  createdByRoleId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  PizzapermissionIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedRoleIds?: string[];

  @IsOptional()
  @IsString()
  lastEditedById?: string;
}

export class DeletePizzaBodyReqDto {
  @IsBoolean()
  @IsOptional()
  hasSoftDeleted?: boolean;
}

export class UpdateAndDeletePizzaBodyReqDto extends IntersectionType(
  UpdatePizzaBodyReqDto,
  DeletePizzaBodyReqDto,
) {}
