import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Action } from '../entities/action.entity';

@Injectable()
export class ActionsService extends TypeOrmCrudService<Action> {
  constructor(@InjectRepository(Action) repo: Repository<Action>) {
    super(repo);
  }

  async findMissingIdsOfAction({ actionIds }: { actionIds: any[] }) {
    try {
      const actions = await this.repo.find({
        select: ['id'],
        where: {
          id: In(actionIds),
        },
      });
      const ids = actions.map((action) => action.id?.toString());
      return ids.filter((id) => !actionIds.includes(id));
    } catch (error) {
      throw new Error(error);
    }
  }
}
