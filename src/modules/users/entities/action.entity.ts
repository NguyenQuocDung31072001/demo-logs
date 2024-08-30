import { BaseEntity } from 'src/shared/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { RolesToActions } from './role-to-action.entity';

@Entity({
  name: 'actions',
})
export class Action extends BaseEntity {
  @Column()
  name: string;

  @Column()
  action_key: string;

  @OneToMany(() => RolesToActions, (roleToActions) => roleToActions.action)
  rolesToActions: RolesToActions[];
}
