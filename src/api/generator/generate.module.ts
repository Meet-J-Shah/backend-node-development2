import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import { GenerateProcessor } from './generate.processor';

@Module({
  imports: [
    BullModule.forRoot({
      // Add this global configuration
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'generate-queue',
    }),
  ],
  controllers: [GenerateController],
  providers: [GenerateService, GenerateProcessor],
})
export class GenerateModule {}
