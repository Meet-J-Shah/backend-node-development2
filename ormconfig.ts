// eslint-disable-next-line @typescript-eslint/no-unused-vars
import entities from './src/configs/entity.config';
import configurations from './src/configs/env.config';

// eslint-disable-next-line prefer-const
let dbConfig = configurations().database;

import { dataSourceOptions } from './src/data-source';

// export default {
//   type: dbConfig.type,
//   host: dbConfig.host,
//   port: dbConfig.port,
//   username: dbConfig.username,
//   password: dbConfig.password,
//   database: dbConfig.database,
//   synchronize: true,
//   logging: true,
//   entities: entities,
//   seeds: dbConfig.seeds,
//   cli: {
//     seedersDir: 'src/db/seeders',
//   },
// };

export default {
  ...dataSourceOptions,
  logging: true,
  seeds: dbConfig.seeds,
  cli: {
    seedersDir: 'src/db/seeders',
  },
};
