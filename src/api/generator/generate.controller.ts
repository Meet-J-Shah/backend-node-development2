import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateDto } from './dto/generate.dto';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { snakeCase } from 'lodash';

function extractErrors(errors: ValidationError[], parentPath = ''): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      for (const constraintMsg of Object.values(error.constraints)) {
        messages.push(`${propertyPath}: ${constraintMsg}`);
      }
    }

    if (error.children && error.children.length > 0) {
      messages.push(...extractErrors(error.children, propertyPath));
    }
  }

  return messages;
}
@Controller({ path: 'admin/generate', version: '1' })
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  async generate(@Body() dto: any) {
    for (const field of dto.fields ?? []) {
      if (field.subTypeOptions) {
        field.subTypeOptions.parentType = field.Type;
      }
    }
    // dto.fields.slice(0, 7).forEach((f, i) => {
    //   console.log(`Field ${i}`, f.subTypeOptions);
    // });

    // check for indices
    const allNames = [];
    const allNamesOfEntites = [];
    if (dto.primaryFields) {
      for (const primaryField of dto.primaryFields ?? []) {
        allNames.push(primaryField.dbName || snakeCase(primaryField.name));
        allNamesOfEntites.push(primaryField.name);
      }
    } else {
      allNames.push('id');
      allNamesOfEntites.push('id');
    }
    for (const field of dto.fields ?? []) {
      if (field.Type === 'Relation') {
        if (
          field.relation.type === 'OneToOne' ||
          field.relation.type === 'ManyToOne'
        ) {
          allNames.push(
            field.relation.joinColumn?.name || snakeCase(field.name) + '_id',
          );
          allNamesOfEntites.push(field.name + 'Id');
        }
      } else {
        allNames.push(field.dbName || snakeCase(field.name));
        allNamesOfEntites.push(field.name);
      }
    }

    for (const index of dto.indices ?? []) {
      const invalid = index.indicesFields.filter(
        (field) => !allNames.includes(field),
      );

      if (invalid.length > 0) {
        throw new BadRequestException(
          `Invalid index fields: ${invalid.join(', ')}. Allowed values are: ${allNames.join(', ')}`,
        );
      }
    }

    for (const Index of dto.indices ?? []) {
      Index.indicesFieldsEntity = [];
      Index.indicesFields.forEach((element) => {
        const position = allNames.findIndex((name) => name === element);
        if (position !== -1) {
          Index.indicesFieldsEntity.push(allNamesOfEntites[position]);
        }
      });
    }
    const dto2 = plainToInstance(GenerateDto, dto);

    const errors = await validate(dto2, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const flatMessages = extractErrors(errors);
      console.error('Validation Errors:\n', flatMessages.join('\n'));
      throw new BadRequestException(flatMessages);
    }

    return this.generateService.enqueue(dto2);
  }
}
