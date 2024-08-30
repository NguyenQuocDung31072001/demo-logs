import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Logs } from './logs.entity';
import { LogsService } from './logs.service';

@ApiTags('logs')
@Crud({
  model: {
    type: Logs,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {},
    exclude: ['id'],
    alwaysPaginate: true,
    limit: 10,
  },
  dto: {},
})
@Controller('logs')
export class LogsController implements CrudController<Logs> {
  constructor(public service: LogsService) {}
}
