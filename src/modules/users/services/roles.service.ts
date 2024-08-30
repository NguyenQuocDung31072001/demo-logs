import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RolesToActions } from '../entities/role-to-action.entity';
import { LogsService } from 'src/modules/logs/logs.service';

@Injectable()
export class RolesService extends TypeOrmCrudService<Role> {
  constructor(
    @InjectRepository(Role) repo: Repository<Role>,
    @InjectRepository(RolesToActions)
    private readonly rolesToActionsRepo: Repository<RolesToActions>,
    private log: LogsService,
  ) {
    super(repo);
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
}
