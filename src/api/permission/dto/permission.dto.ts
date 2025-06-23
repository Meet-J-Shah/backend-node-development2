import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
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
  permissionId: string;
}

export class MultiplePrimaryKeyPermissionDto {
  @ValidateNested({ each: true })
  @Type(() => PrimaryKeysPermissionDto)
  items: PrimaryKeysPermissionDto[];
}
