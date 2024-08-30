import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs<TypeOrmModuleOptions>('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // entities: [resolve(process.cwd(), './**/**/*entity{.ts,.js}')],
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  autoLoadEntities: true,
  synchronize: false,
  // logging: process.env.NODE_ENV !== 'production',
  migrations: [join(__dirname, '../../migrations/*{.ts,.js}')],
  migrationsRun: true,
}));
