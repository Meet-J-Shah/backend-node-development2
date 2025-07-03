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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserBodyReqDto<T> {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    example: 'StrongPass123!',
    description: 'User password (6-20 characters)',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  lastName: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    example: ['admin', 'user'],
    description: 'Array of user roles',
  })
  roles: T[];
}

export class UserBodyUpdateReqDto<T> {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'updated@example.com',
    description: 'Updated email address',
  })
  email?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsOptional()
  @ApiPropertyOptional({
    example: 'NewPass123',
    description: 'Updated password (optional)',
  })
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Jane',
    description: 'Updated first name (optional)',
  })
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Smith',
    description: 'Updated last name (optional)',
  })
  lastName?: string;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: ['editor'],
    description: 'Updated roles (optional)',
  })
  roles?: T[];

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    example: false,
    description: 'Mark as soft deleted (optional)',
  })
  hasSoftDeleted?: boolean;
}

export class PrimaryKeysUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user-uuid-123', description: 'Primary key of user' })
  userId: string;
}

export class MultiplePrimaryKeysUserDto {
  @ValidateNested({ each: true })
  @Type(() => PrimaryKeysUserDto)
  @ApiProperty({
    type: [PrimaryKeysUserDto],
    description: 'List of user primary keys',
    example: [{ userId: 'user-uuid-123' }, { userId: 'user-uuid-456' }],
  })
  items: PrimaryKeysUserDto[];
}

export class UserWhereDto {
  @ApiPropertyOptional({
    example: 'user-uuid-123',
    description: 'User ID for filtering',
  })
  id?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email for filtering',
  })
  email?: string;
}

export class DeleteUserBodyReqDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    example: true,
    description: 'Whether to perform a soft delete instead of hard delete',
  })
  hasSoftDeleted?: boolean;
}
