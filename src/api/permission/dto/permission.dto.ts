import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindManyPermissionQueryReq {
  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  @ApiProperty({ example: 1, description: 'Page number for pagination' })
  page: number;

  @IsInt()
  @Transform(({ value }) => Number.parseInt(value))
  @ApiProperty({ example: 10, description: 'Number of records per page' })
  limit: number;
}

export class PrimaryKeysPermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'perm-123',
    description: 'Primary key of the permission',
  })
  id: string;
}

export class MultiplePrimaryKeysPermissionDto {
  @ValidateNested({ each: true })
  @Type(() => PrimaryKeysPermissionDto)
  @ApiProperty({
    type: [PrimaryKeysPermissionDto],
    description: 'Array of permission primary keys for bulk actions',
  })
  items: PrimaryKeysPermissionDto[];
}

export class CreatePermissionBodyReqDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({ example: 'Role', description: 'Module name for permission' })
  module: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({
    example: 'Create',
    description: 'Action for permission (CRUD)',
  })
  action: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @ApiProperty({
    example: 'role_create',
    description: 'Unique slug for the permission',
  })
  slug: string;
}

export class UpdatePermissionBodyReqDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({
    example: 'User',
    description: 'Updated module name',
    required: false,
  })
  module?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty({
    example: 'Update',
    description: 'Updated action name',
    required: false,
  })
  action?: string;
}
