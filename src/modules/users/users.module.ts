import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Action } from './entities/action.entity';
import { UsersController, RolesController, ActionsController } from './controllers';
import { ActionsService, RolesService, RolesToActionService, UsersService } from './services';
import { RolesToActions } from './entities/role-to-action.entity';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Action, RolesToActions]), LogsModule],
  controllers: [UsersController, RolesController, ActionsController],
  providers: [UsersService, RolesService, ActionsService, RolesToActionService],
})
export class UsersModule {}
