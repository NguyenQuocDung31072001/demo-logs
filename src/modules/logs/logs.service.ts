import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from './logs.entity';
import { Override } from '@nestjsx/crud';

@Injectable()
export class LogsService extends TypeOrmCrudService<Logs> {
  constructor(@InjectRepository(Logs) repo: Repository<Logs>) {
    super(repo);
  }
  @Override('createOneBase')
  async record(info: string) {
    const log = new Logs();
    log.info = info;
    return this.repo.save(log);
  }
}
