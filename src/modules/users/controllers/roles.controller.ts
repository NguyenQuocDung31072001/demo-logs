import { Controller } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RolesService } from '../services';
import { LogsService } from 'src/modules/logs/logs.service';

@ApiTags('users')
@Crud({
  model: {
    type: User,
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
      users: {},
      rolesToActions: {},
    },
    exclude: ['id'],
    alwaysPaginate: true,
    limit: 10,
  },
})
@Controller('roles')
export class RolesController implements CrudController<Role> {
  constructor(public service: RolesService, public logs: LogsService) {}

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest) {
    const dataRoleEntity = (await this.service.getOne(req)) as Role;
    const actionsOfRole = await this.service.getActionDetailByRoleId(dataRoleEntity.id);

    this.logs.record('Role ' + dataRoleEntity.name + ' was viewed');

    return {
      ...dataRoleEntity,
      actions: actionsOfRole,
    };
  }

  @Override('getManyBase')
  async getMany(@ParsedRequest() req: CrudRequest) {
    const dataRoleEntity = (await this.service.getMany(req)) as GetManyDefaultResponse<Role>;

    const { data, ...rest } = dataRoleEntity;

    const dataWithActions = [];

    for (const item of data) {
      const { rolesToActions, ...rest } = item;
      const actionsOfRole = await this.service.getActionDetailByRoleId(rest.id);

      dataWithActions.push({
        ...rest,
        actions: actionsOfRole,
      });
    }
    this.logs.record('Roles were viewed');

    return {
      data: dataWithActions,
      ...rest,
    };
  }

  @Override('createOneBase')
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody()
    dto: {
      name: string;
      role_key: string;
      actions: string[];
    },
  ) {
    this.logs.record('Role ' + dto.name + ' was created');

    const newRoles = await this.service.createOne(req, dto);
    await this.service.createManyRoleToAction({ roleId: newRoles.id, actionIds: dto.actions });

    return newRoles;
  }

  @Override('updateOneBase')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody()
    dto: {
      name: string;
      role_key: string;
      actions: string[];
    },
  ) {
    this.logs.record('Role ' + dto.name + ' was updated');
    const updatedRoles = await this.service.updateOne(req, dto);
    if (dto.actions?.length > 0) {
      const currentActions = await this.service.getActionDetailByRoleId(updatedRoles.id);
      const currentActionsIds = currentActions.map((item) => item.id);
      const actionsToDelete = currentActionsIds.filter((item) => !dto.actions.includes(item?.toString()));
      const actionsToAdd = dto.actions.filter((item) => !currentActionsIds.some((i) => i?.toString() === item));

      if (actionsToDelete.length > 0) {
        await this.service.deleteRoleToActionByIds({
          roleId: updatedRoles.id,
          ids: actionsToDelete,
        });
      }
      if (actionsToAdd.length > 0) {
        await this.service.createManyRoleToAction({ roleId: updatedRoles.id, actionIds: actionsToAdd });
      }
    }
    return updatedRoles;
  }

  @Override('deleteOneBase')
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    this.logs.record('Role was deleted');
    const dataRoleEntity = (await this.service.getOne(req)) as Role;

    await this.service.deleteManyRoleToActionByRoleId(dataRoleEntity.id);

    return this.service.deleteOne(req);
  }
}
