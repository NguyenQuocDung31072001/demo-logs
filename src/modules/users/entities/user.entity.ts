import { BaseEntity } from 'src/shared/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Column()
  full_name: string;

  @Column()
  user_name: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({
    nullable: true,
  })
  user_role_id?: string;
}
