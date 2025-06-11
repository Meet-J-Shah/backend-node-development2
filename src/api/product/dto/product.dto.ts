/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IntersectionType } from '@nestjs/mapped-types';
export class ProductFullBodyReqDto {
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

export class FindManyProductQueryReq {
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  page: number;

  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;
}

export class FindOneProductParamReqDto {
  @IsString()
  @IsNotEmpty()
  ProductId: string;
}

export class CreateProductBodyReqDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  price: number;
}

export class UpdateProductBodyReqDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  @IsOptional()
  price?: number;
}

export class DeleteProductBodyReqDto {
  @IsBoolean()
  @IsOptional()
  hasSoftDeleted?: boolean;
}

export class UpdateAndDeleteProductBodyReqDto extends IntersectionType(
  UpdateProductBodyReqDto,
  DeleteProductBodyReqDto,
) {}
