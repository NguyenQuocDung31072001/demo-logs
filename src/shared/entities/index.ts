import { ApiProperty } from "@nestjs/swagger";
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn({
    type: "integer",
  })
  id: number;

  @ApiProperty()
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    nullable: true,
  })
  created_at?: Date;

  @ApiProperty()
  @DeleteDateColumn({
    type: "timestamp",
    nullable: true,
  })
  deleted_at?: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    nullable: true,
  })
  updated_at?: Date;
}
