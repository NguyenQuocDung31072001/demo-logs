import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AMAConfigModule, AMAConfigService } from './shared/ama';
import { ConfigModule } from '@nestjs/config';
import { ActuatorModule } from './actuator/actuator.module';
import { UsersModule } from './modules/users/users.module';
import { LogsModule } from './modules/logs/logs.module';

@Module({
  imports: [
    AMAConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [AMAConfigModule],
      inject: [AMAConfigService],
      useFactory: (cf: AMAConfigService) => cf.get('database'),
    }),
    ConfigModule.forRoot(),
    ActuatorModule,
    UsersModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consume: MiddlewareConsumer) {
    /* TODO document why this method 'configure' is empty */
  }
}
