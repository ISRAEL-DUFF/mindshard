import { defineConfig } from '@mikro-orm/postgresql';
import { Adapter } from './src/modules/adapters/adapter.entity';

export default defineConfig({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: process.env.DB_NAME || 'mindshard',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  debug: process.env.NODE_ENV !== 'production',
  discovery: {
    warnWhenNoEntities: true,
    requireEntitiesArray: false,
  },
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    snapshot: false,
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './src/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
  driverOptions: {
    connection: {
      ssl: { rejectUnauthorized: false },
    },
  }
});