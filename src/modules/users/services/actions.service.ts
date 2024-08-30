import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from '../entities/action.entity';

@Injectable()
export class ActionsService extends TypeOrmCrudService<Action> {
  constructor(@InjectRepository(Action) repo: Repository<Action>) {
    super(repo);
  }
}
