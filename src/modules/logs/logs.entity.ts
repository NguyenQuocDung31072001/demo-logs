import { BaseEntity } from 'src/shared/entities';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'logs',
})
export class Logs extends BaseEntity {
  @Column()
  info: string;
}
