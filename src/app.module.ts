import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import envConfig from './configs/env.config';
import { DatabaseConfig } from './configs/database.config';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    // import env config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    DatabaseConfig,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true, // Strips properties that do not have any decorators
          forbidNonWhitelisted: true, // Throws an error if there are any non-whitelisted properties
          transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
        }),
    },
  ],
})
export class AppModule {}
