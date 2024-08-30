import { DataSource, DataSourceOptions } from "typeorm";
import { resolve } from "path";
import databaseConfig from "./database.config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AMAConfigModule } from "src/shared/ama";

AMAConfigModule.forRoot();

const options = databaseConfig() as TypeOrmModuleOptions as DataSourceOptions;

export default new DataSource({
  ...options,
  migrations: [resolve(process.cwd(), "migrations/*{.ts,.js}")],
  logging: false,
});
