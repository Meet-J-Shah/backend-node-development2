import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  ValidateNested,
  IsObject,
  IsIn,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsValidEntityTarget,
  IsValidInverseSide,
} from '../../../decorators/relationValid.decorator';

class JoinColumnOptionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  referencedColumnName?: string;
}

class JoinTableOptionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => JoinColumnOptionsDto)
  joinColumn?: JoinColumnOptionsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => JoinColumnOptionsDto)
  inverseJoinColumn?: JoinColumnOptionsDto;
}

class RelationDto {
  @IsString()
  @IsIn(['OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany'])
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

  @IsOptional()
  @ValidateNested()
  @Type(() => JoinColumnOptionsDto)
  joinColumn?: JoinColumnOptionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => JoinTableOptionsDto)
  joinTable?: JoinTableOptionsDto;

  @IsOptional()
  @IsBoolean()
  cascade?: boolean = false;

  @IsOptional()
  @IsString()
  @IsIn(['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION'])
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';

  @IsOptional()
  @IsString()
  @IsIn(['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION'])
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';

  @IsOptional()
  @IsBoolean()
  nullable?: boolean = true;
}

class FieldDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  dbName?: string;

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
  @IsArray()
  @IsString({ each: true })
  enum?: string[];

  @IsOptional()
  @ValidateIf((o) => typeof o.default === 'number')
  @IsNumber()
  @ValidateIf((o) => typeof o.default === 'string')
  @IsString()
  default?: number | string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RelationDto)
  relation?: RelationDto;
}
class primaryFieldDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  dbName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['string', 'number'])
  type?: 'string' | 'number';

  @IsOptional()
  @IsString()
  @IsIn(['int', 'bigint', 'uuid'])
  dtype?: 'int' | 'bigint' | 'uuid';
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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => primaryFieldDto)
  primaryFields: primaryFieldDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreationConfigDto)
  creationConfig?: CreationConfigDto;
}
