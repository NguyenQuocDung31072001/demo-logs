import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolesToActions } from '../entities/role-to-action.entity';
import { LogsService } from 'src/modules/logs/logs.service';
import { ActionsService } from './actions.service';

@Injectable()
export class RolesService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role) repo: Repository<Role>,
    @InjectRepository(RolesToActions)
    private readonly rolesToActionsRepo: Repository<RolesToActions>,
    private log: LogsService,
    private actionServices: ActionsService,
  ) {
    super(repo);
  }

  async rawUpdateOne({ id, name, role_key }: { id: string; name: string; role_key: string }) {
    return await this.repo.update(id, { name, role_key });
  }
  async createManyRoleToAction({ roleId, actionIds }: { roleId: any; actionIds: any[] }) {
    actionIds.forEach(async (actionId) => {
      const rolesToAction = new RolesToActions();
      rolesToAction.role = roleId;
      rolesToAction.action = actionId;
      this.log.record('Role ' + roleId + ' was assigned to action ' + actionId);
      await this.rolesToActionsRepo.save(rolesToAction);
    });
  }

  async deleteRoleToActionByIds({ roleId, ids }: { roleId: any; ids: any[] }) {
    this.log.record('Role ' + roleId + ' was unassigned to actions ' + ids);
    await this.rolesToActionsRepo.delete({
      role: {
        id: roleId,
      },
      action: {
        id: In(ids),
      },
    });
  }

  async deleteManyRoleToActionByRoleId(roleId: any) {
    this.log.record('Role ' + roleId + ' was unassigned to all actions');
    await this.rolesToActionsRepo.delete({
      role: {
        id: roleId,
      },
    });
  }

  async getActionDetailByRoleId(roleId: any) {
    const data = await this.rolesToActionsRepo.find({
      select: {
        action: {
          id: true,
          name: true,
          action_key: true,
        },
      },
      where: {
        role: {
          id: roleId,
        },
      },
      relations: ['action'],
    });

    return data?.map((item) => item.action);
  }

  async getIdOfActionsByRoleId(roleId: any) {
    const result = await this.rolesToActionsRepo.find({
      select: ['action'],
      where: {
        role: {
          id: roleId,
        },
      },
      relations: ['action'],
    });
    return result.map((item) => item.action.id);
  }

  async validateIdsOfActions({
    roleId,
    actionsToAdd,
    actionsToRemove,
  }: {
    roleId: string;
    actionsToAdd: string[];
    actionsToRemove: string[];
  }) {
    const missingIdsAdd = await this.actionServices.findMissingIdsOfAction({ actionIds: actionsToAdd });

    if (missingIdsAdd.length > 0) {
      throw new Error('Some actions to add are not found');
    }

    const checkActionsToAddExistInPivotTable = await this.rolesToActionsRepo.find({
      select: ['action'],
      where: {
        role: {
          id: roleId as any,
        },
        action: {
          id: In(actionsToAdd),
        },
      },
      relations: ['action'],
    });

    if (checkActionsToAddExistInPivotTable.length > 0) {
      throw new Error('Some actions to add are already assigned to the role');
    }

    const missingIdsRemove = await this.actionServices.findMissingIdsOfAction({ actionIds: actionsToRemove });

    if (missingIdsRemove.length > 0) {
      throw new Error('Some actions to remove are not found');
    }

    const checkActionsToRemoveNotExistInPivotTable = await this.rolesToActionsRepo.find({
      select: ['action'],
      where: {
        role: {
          id: roleId as any,
        },
        action: {
          id: In(actionsToRemove),
        },
      },
      relations: ['action'],
    });

    if (checkActionsToRemoveNotExistInPivotTable.length !== actionsToRemove.length) {
      throw new Error('Some actions to remove are not assigned to the role');
    }
  }
}
