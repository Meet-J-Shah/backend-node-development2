import { Module } from '@nestjs/common';

import { GlobalService } from './global.service';
import { CustomLogger } from '../logger/logger.service';

@Module({
  providers: [GlobalService, CustomLogger],
  exports: [GlobalService],
})
export class GlobalModule {}
