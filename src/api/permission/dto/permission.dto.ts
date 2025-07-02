import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindManyPermissionQueryReq {
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  page: number;

  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  limit: number;
}

export class PrimaryKeysPermissionDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class MultiplePrimaryKeysPermissionDto {
  @ValidateNested({ each: true })
  @Type(() => PrimaryKeysPermissionDto)
  items: PrimaryKeysPermissionDto[];
}

export class CreatePermissionBodyReqDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  module: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  action: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  slug: string;
}

export class UpdatePermissionBodyReqDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  module?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  action?: string;
}
