import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FieldDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}

export class GenerateDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  fields: FieldDto[];
}
