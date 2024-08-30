import { Module } from '@nestjs/common';
import { ActuatorService } from './actuator.service';
import { ActuatorController } from './actuator.controller';

@Module({
  controllers: [ActuatorController],
  providers: [ActuatorService],
})
export class ActuatorModule {}
