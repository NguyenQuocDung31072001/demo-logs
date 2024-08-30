import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AMAConfigService } from "./ama-config.service";
import databaseConfig from "src/config/database.config";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
      isGlobal: true,
      load: [databaseConfig],
    }),
  ],
})
export class AMAConfigModule {
  static forRoot() {
    return {
      module: AMAConfigModule,
      providers: [AMAConfigService],
      exports: [AMAConfigService],
    };
  }
}
