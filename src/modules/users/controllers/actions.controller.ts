import { Controller } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { Action } from '../entities/action.entity';
import { ActionsService } from '../services';
import { LogsService } from 'src/modules/logs/logs.service';

@ApiTags('actions')
@Crud({
  model: {
    type: Action,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      role: {},
      rolesToActions: {},
    },
    exclude: ['id'],
    alwaysPaginate: true,
    limit: 10,
  },
  dto: {},
})
@Controller('actions')
export class ActionsController implements CrudController<Action> {
  constructor(public service: ActionsService, public logs: LogsService) {}

  @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: any) {
    return this.service.createOne(req, dto);
  }
}
