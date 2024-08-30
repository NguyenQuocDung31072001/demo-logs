import { BaseEntity } from 'src/shared/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Action } from './action.entity';

@Entity({
  name: 'rolesToActions',
})
export class RolesToActions extends BaseEntity {
  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Action, (action) => action.id)
  @JoinColumn({ name: 'action_id' })
  action: Action;
}
