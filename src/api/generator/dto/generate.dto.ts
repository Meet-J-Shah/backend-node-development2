import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  ValidateNested,
  IsObject,
  IsIn,
  ValidateIf,
  ArrayMaxSize,
  IsDefined,
  IsNotEmpty,
  Min,
  Max,
  IsEmpty,
  ArrayUnique,
  ArrayNotEmpty,
  // Matches,
  // ArrayUnique,
  // ArrayNotEmpty,
  // IsEmail,
  // Validate,
  // IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsValidEntityTarget,
  IsValidInverseSide,
} from '../../../decorators/relationValid.decorator';
import { AllowOnlyForSubTypes } from '../../../validators/allowSubtypes.validator';
import { IsValidDefault } from '../../../validators/defaultvalue.validator';

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

  @ValidateIf((o) => ['OneToOne', 'OneToMany', 'ManyToOne'].includes(o.type))
  @IsOptional()
  @ValidateNested()
  @Type(() => JoinColumnOptionsDto)
  joinColumn?: JoinColumnOptionsDto;

  @ValidateIf((o) => o.type === 'ManyToMany')
  @IsOptional()
  @ValidateNested()
  @Type(() => JoinTableOptionsDto)
  joinTable?: JoinTableOptionsDto;

  // Explicitly throw error when joinTable is defined for types != ManyToMany
  @ValidateIf((o) => o.type !== 'ManyToMany' && !!o.joinTable)
  @IsEmpty({
    message:
      'joinTable must not be defined unless relation type is "ManyToMany"',
  })
  private _invalidJoinTable?: any;

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
const allowedSubTypesMap = {
  String: ['varchar', 'char'],
  Text: ['tinytext', 'mediumtext', 'text'],
  Json: ['json'],
  Boolean: ['boolean'],
  Enum: ['enum'],
  Set: ['simple-array'],
  Uid: ['uuid', 'bigint', 'string'],
  DateTime: ['date', 'datetime', 'timestamp', 'time'],
  Number: ['smallint', 'int', 'bigint', 'float', 'double', 'decimal'],
  Email: ['email'],
  Password: ['password'],
  PhoneNumber: ['localPhoneNumber', 'internationalPhoneNumber'],
};
export class SubTypeOptionsDto {
  // Needed for conditional validation
  parentType?: string;

  @ValidateIf((o) => {
    const allowed = allowedSubTypesMap[o.parentType] ?? [];
    return allowed.length > 0;
  })
  @IsIn(Object.values(allowedSubTypesMap).flat(), {
    message: (args) => {
      const parentType = (args.object as any).parentType;
      const allowed = allowedSubTypesMap[parentType] ?? [];
      return `subType must be one of [${allowed.join(', ')}] for parentType "${parentType}"`;
    },
  })
  subType: string;

  @ValidateIf((o) => o.parentType === 'String')
  @IsDefined()
  @IsInt()
  length?: number;

  @AllowOnlyForSubTypes(['char', 'varchar'], ['length'])
  private __stringFieldsOnly__: any;

  @ValidateIf((o) => o.subType === 'decimal')
  @IsOptional()
  @IsInt()
  m?: number;

  @ValidateIf((o) => o.subType === 'decimal')
  @IsOptional()
  @IsInt()
  d?: number;

  @AllowOnlyForSubTypes(['decimal'], ['m', 'd'])
  private __decimalFieldsOnly__: any;

  @ValidateIf((o) => o.subType === 'password')
  @IsOptional()
  @IsInt({ message: 'minLength must be an integer' })
  @Min(4, { message: 'minLength must be at least 4 characters' })
  @Max(20, { message: 'minLength must not exceed 20 characters' })
  minLength?: number;

  @ValidateIf((o) => o.subType === 'Password')
  @IsOptional()
  @IsInt()
  @Max(20, { message: 'maxLength must not exceed 20 characters' })
  @Min(4, { message: 'maxLength must be at least 4 characters' })
  maxLength?: number;

  @ValidateIf((o) => o.subType === 'password')
  @IsOptional()
  @IsBoolean()
  Numeric?: boolean = true;

  @ValidateIf((o) => o.subType === 'password')
  @IsOptional()
  @IsBoolean()
  specialCharaters?: boolean = true;

  // @AllowOnlyForSubTypes(
  //   ['password'],
  //   ['minLength', 'maxLength', 'Numeric', 'specialCharaters'],
  // )
  // private __passwordFieldsOnly__: any;

  @ValidateIf((o) => o.parentType === 'Enum' || o.parentType === 'Set')
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsDefined()
  @IsString({ each: true })
  values?: string[];

  @AllowOnlyForSubTypes(['enum', 'simple-array'], ['values'])
  private __valueFieldsOnly__: any;

  // @ValidateIf((o) => ['decimal', 'float', 'double'].includes(o.subType))
  // @Matches(/^-?\d+(\.\d+)?$/, {
  //   message: 'Default must be a valid decimal/float string',
  // })

  // // Integer types
  // @ValidateIf((o) => ['int', 'bigint', 'smallint'].includes(o.subType))
  // @IsInt()

  // // Boolean
  // @ValidateIf((o) => o.subType === 'boolean')
  // @IsBoolean()

  // // String types
  // @ValidateIf((o) =>
  //   ['varchar', 'char', 'tinytext', 'text'].includes(o.subType),
  // )
  // @IsString()

  // // Date types
  // @ValidateIf((o) => o.subType === 'time')
  // @Matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$|^NOW\(\)$|^CURRENT_TIME$/, {
  //   message:
  //     'Default for TIME must be in HH:mm:ss format or NOW() or CURRENT_TIME',
  // })
  // @ValidateIf((o) => o.subType === 'date')
  // @Matches(/^\d{4}-\d{2}-\d{2}$|^CURRENT_DATE$/, {
  //   message: 'Default for DATE must be in YYYY-MM-DD format or CURRENT_DATE',
  // })
  // @ValidateIf((o) => o.subType === 'datetime')
  // @Matches(
  //   /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$|^NOW\(\)$|^CURRENT_TIMESTAMP$/,
  //   {
  //     message:
  //       'Default for DATETIME must be in YYYY-MM-DD HH:mm:ss format, NOW() or CURRENT_TIMESTAMP',
  //   },
  // )
  // @ValidateIf((o) => o.subType === 'timestamp')
  // @Matches(
  //   /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$|^NOW\(\)$|^CURRENT_TIMESTAMP$/,
  //   {
  //     message:
  //       'Default for TIMESTAMP must be in ISO 8601 format (UTC) or NOW() or CURRENT_TIMESTAMP',
  //   },
  // )

  // // Enum
  // @ValidateIf((o) => o.parentType === 'Enum' && Array.isArray(o.values))
  // @IsString()
  // @ValidateIf((o) => Array.isArray(o.values) && o.values.includes(o.default))

  // // Set (simple-array)
  // @ValidateIf((o) => o.parentType === 'Set' && Array.isArray(o.values))
  // @IsArray()
  // @ArrayNotEmpty()
  // @ArrayUnique()
  // @IsString({ each: true })
  // @ValidateIf(
  //   (o) =>
  //     Array.isArray(o.default) &&
  //     Array.isArray(o.values) &&
  //     o.default.every((val: string) => o.values.includes(val)),
  // )

  // // for email
  // @ValidateIf((o) => o.subType === 'email')
  // @IsEmail({}, { message: 'Default must be a valid email address' })

  // // for local phone number
  // @ValidateIf((o) => o.subType === 'localPhoneNumber')
  // @IsPhoneNumber('IN', {
  //   message: 'Default must be a valid Indian phone number',
  // })
  // @ValidateIf((o) => o.subType === 'internationalPhoneNumber')
  // @IsPhoneNumber(null, { message: 'Default must be a valid phone number' })

  // // for password
  // @ValidateIf((o) => o.subType === 'password')
  // @Validate(DynamicPasswordValidator)

  // // Disallow for all others
  // @ValidateIf(
  //   (o) =>
  //     ![
  //       'decimal',
  //       'float',
  //       'double',
  //       'int',
  //       'bigint',
  //       'smallint',
  //       'boolean',
  //       'varchar',
  //       'char',
  //       'tinytext',
  //       'text',
  //       'date',
  //       'datetime',
  //       'timestamp',
  //       'time',
  //       'enum',
  //       'simple-array',
  //       'email',
  //       'localPhoneNumber',
  //       'internationalPhoneNumber',
  //       'password',
  //     ].includes(o.subType),
  // )
  // @IsEmpty({ message: 'Default not supported for this subtype' })
  // default?: string | number | boolean | string[] | Date;
  @IsValidDefault({ message: 'Invalid default value for the given subType' })
  default?: string | number | boolean | string[] | Date;
}

class FieldDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  dbName?: string;

  @IsString()
  @IsIn([
    'String',
    'Text',
    'Boolean',
    'Json',
    'Enum',
    'Set',
    'Uid',
    'DateTime',
    'Number',
    'Relation',
    'Email',
    'Password',
    'PhoneNumber',
  ])
  @IsNotEmpty()
  @IsDefined()
  Type:
    | 'String'
    | 'Text'
    | 'Boolean'
    | 'Json'
    | 'Enum'
    | 'Set'
    | 'Uid'
    | 'DateTime'
    | 'Number'
    | 'Relation'
    | 'Email'
    | 'Password'
    | 'PhoneNumber';

  @ValidateIf((o) => o.Type !== 'Relation')
  @ValidateNested()
  @Type(() => SubTypeOptionsDto)
  @IsDefined()
  subTypeOptions?: SubTypeOptionsDto;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  dtype?: string;

  // @IsOptional()
  // @IsInt()
  // length?: number;

  @IsOptional()
  @IsBoolean()
  nullable?: boolean;

  @IsOptional()
  @IsBoolean()
  unique?: boolean;

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // enum?: string[];

  // @IsOptional()
  // @ValidateIf((o) => typeof o.default === 'number')
  // @IsNumber()
  // @ValidateIf((o) => typeof o.default === 'string')
  // @IsString()
  // default?: number | string;

  @ValidateIf((o) => o.Type === 'Relation')
  @IsDefined({ message: 'relation must be defined when Type is "Relation"' })
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
  @ArrayMaxSize(1)
  @ValidateNested({ each: true })
  @Type(() => primaryFieldDto)
  primaryFields: primaryFieldDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreationConfigDto)
  creationConfig?: CreationConfigDto;
}
