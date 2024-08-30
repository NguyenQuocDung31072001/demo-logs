import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/shared/entities';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { RolesToActions } from './role-to-action.entity';

@Entity({
  name: 'roles',
})
export class Role extends BaseEntity {
  @Column()
  name: string;

  @Column()
  role_key: string;

  @OneToMany(() => User, (user) => user.role)
  @JoinColumn({ name: 'users' })
  users: User[];

  @OneToMany(() => RolesToActions, (roleToActions) => roleToActions.role)
  rolesToActions: RolesToActions[];
}
