import { Controller, Post, Body } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateDto } from './dto/generate.dto';

@Controller({ path: 'admin/generate', version: '1' })
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  async generate(@Body() dto: GenerateDto) {
    return this.generateService.enqueue(dto);
  }
}
