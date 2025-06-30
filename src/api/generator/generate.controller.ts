import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateDto } from './dto/generate.dto';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

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
    dto.fields.slice(0, 7).forEach((f, i) => {
      console.log(`Field ${i}`, f.subTypeOptions);
    });
    const dto2 = plainToInstance(GenerateDto, dto);

    const errors = await validate(dto2);

    if (errors.length > 0) {
      const flatMessages = extractErrors(errors);
      console.error('Validation Errors:\n', flatMessages.join('\n'));
      throw new BadRequestException(flatMessages);
    }

    return this.generateService.enqueue(dto2);
  }
}
