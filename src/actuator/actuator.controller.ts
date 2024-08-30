import { All, Controller } from '@nestjs/common';
import { ActuatorService } from './actuator.service';

@Controller('actuator')
export class ActuatorController {
  constructor(private readonly actuatorService: ActuatorService) {}

  @All('health/liveness')
  liveness() {
    return new Date().toISOString();
  }

  @All('health/readiness')
  readiness() {
    return 'OK';
  }
}
