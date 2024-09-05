import { Body, Controller, HttpException, HttpStatus, Param, Patch } from '@nestjs/common';
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
import { ActionsService, RolesService } from '../services';
import { LogsService } from 'src/modules/logs/logs.service';
import { getAddAndDeleteIds } from 'src/shared/helper/get-add-and-delete-ids';
import { log } from 'console';

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
  constructor(public service: RolesService, public logs: LogsService, public actionServices: ActionsService) {}

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

  @Patch('/update-custom/:id')
  async updateCustom(
    @Param('id') id: string,
    @Body()
    dto: {
      name: string;
      role_key: string;
      actions: {
        create: string[];
        delete: string[];
      };
    },
  ) {
    try {
      const { create: actionsToAdd, delete: actionsToRemove } = dto.actions;

      await this.service.validateIdsOfActions({ roleId: id, actionsToAdd, actionsToRemove });

      if (actionsToRemove.length > 0) {
        await this.service.deleteRoleToActionByIds({
          roleId: id,
          ids: actionsToRemove,
        });
      }
      if (actionsToAdd.length > 0) {
        await this.service.createManyRoleToAction({ roleId: id, actionIds: actionsToAdd });
      }
      this.logs.record('Role ' + dto.name + ' was updated');

      return await this.service.rawUpdateOne({ id: id, name: dto.name, role_key: dto.role_key });
    } catch (error) {
      this.logs.record('Error: ' + error.message);
      throw new HttpException(new Error(error).message, HttpStatus.BAD_REQUEST);
    }
  }

  @Override('updateOneBase')
  async updateOne(
    @Param('id') id: string,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody()
    dto: {
      name: string;
      role_key: string;
      actions: string[];
    },
  ) {
    this.logs.record('Role ' + dto.name + ' was updated');
    if (dto.actions?.length > 0) {
      const currentActionsIds = await this.service.getIdOfActionsByRoleId(id);

      const { addIds, deleteIds } = getAddAndDeleteIds({
        currentIds: currentActionsIds,
        requestedIds: dto.actions,
      });

      if (deleteIds.length > 0) {
        await this.service.deleteRoleToActionByIds({
          roleId: id,
          ids: deleteIds,
        });
      }
      if (addIds.length > 0) {
        await this.service.createManyRoleToAction({ roleId: id, actionIds: addIds });
      }
    }
    return await this.service.updateOne(req, dto);
  }

  @Override('deleteOneBase')
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    this.logs.record('Role was deleted');
    const dataRoleEntity = (await this.service.getOne(req)) as Role;

    await this.service.deleteManyRoleToActionByRoleId(dataRoleEntity.id);

    return this.service.deleteOne(req);
  }
}
