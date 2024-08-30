import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

const BASE_FIELDS_EXCLUSION = ['created_at', 'updated_at'];

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
      role: {},
    },
    exclude: ['id'],
    alwaysPaginate: true,
    limit: 10,
  },
  dto: {},
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  @Override('createOneBase')
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: CreateUserDto) {
    console.log('createOneBase ', req.parsed, dto);

    return this.service.createOne(req, dto);
  }
}
