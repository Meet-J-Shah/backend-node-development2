import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsValidEntityTarget,
  IsValidInverseSide,
} from '../../../decorators/relationValid.decorator';

class RelationDto {
  @IsString()
  type: 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany';

  @IsString()
  @IsValidEntityTarget({ message: 'Target entity does not exist.' })
  target: string;

  @IsOptional()
  @IsString()
  @IsValidInverseSide({ message: 'Invalid inverseSide for target entity.' })
  inverseSide?: string;

  @IsOptional()
  @IsBoolean()
  uniDirectional?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isArray?: boolean = false;
}

class FieldDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  dtype?: string;

  @IsOptional()
  @IsInt()
  length?: number;

  @IsOptional()
  @IsBoolean()
  nullable?: boolean;

  @IsOptional()
  @IsBoolean()
  unique?: boolean;

  @IsOptional()
  @IsNumber()
  default?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => RelationDto)
  relation?: RelationDto;
}

class CreationConfigDto {
  @IsOptional()
  @IsBoolean()
  withTimestamps?: boolean;

  @IsOptional()
  @IsBoolean()
  withSoftDelete?: boolean;

  @IsOptional()
  @IsBoolean()
  operator?: boolean;
}

export class GenerateDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  fields: FieldDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreationConfigDto)
  creationConfig?: CreationConfigDto;
}
