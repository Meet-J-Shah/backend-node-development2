import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import entities from './entity.config';

export const DatabaseConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    type: configService.get<string>('database.type') as any,
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    entities,
    seeds: configService.get<string[]>('database.seeds'),
    // TODO: append entities dynamically
    // entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    // entities: [__dirname + 'src/db/entities/*.entity{.ts,.js}'],
    synchronize: false,
    // synchronize: configService.get<string>('env') === NODE_ENV.DEVELOPMENT,
    logging: true, //configService.get<boolean>('database.log'),
    // TODO: add migrations
    // migrations: ['src/db/migrations/*{.ts,.js}'],
    // subscribers: ['src/db/subscribers/*{.ts,.js}'],
    // cli: {
    //   migrationsDir: 'src/migrations'
    // },
    // migrationsRun: true,
  }),
  inject: [ConfigService],
});
