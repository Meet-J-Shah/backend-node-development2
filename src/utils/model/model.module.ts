import { Module } from '@nestjs/common';

import { ModelService } from './model.service';
import { CustomLogger } from '../logger/logger.service';

@Module({
  imports: [ModelModule],
  providers: [ModelService, CustomLogger],
  exports: [ModelService],
})
export class ModelModule { }
