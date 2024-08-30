import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesToActions } from '../entities/role-to-action.entity';

@Injectable()
export class RolesToActionService extends TypeOrmCrudService<RolesToActions> {
  constructor(@InjectRepository(RolesToActions) repo: Repository<RolesToActions>) {
    super(repo);
  }
}
