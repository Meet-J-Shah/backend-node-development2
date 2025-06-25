import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsString,
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
  @ArrayMinSize(2, { message: 'At least two permission keys are required' })
  @Type(() => PrimaryKeysPermissionDto)
  items: PrimaryKeysPermissionDto[];
}
