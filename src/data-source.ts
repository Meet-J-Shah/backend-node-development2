import entities from '../src/configs/entity.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import migrations from '../src/configs/migration.config';
import { ConfigModule } from '@nestjs/config';
import envConfig from './configs/env.config';

// this will load the env variables. without this we will not allowed to use the env variables
ConfigModule.forRoot({
  isGlobal: true,
  load: [envConfig],
});

// eslint-disable-next-line prefer-const
let dbConfig = envConfig().database;

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities,
  migrations,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
