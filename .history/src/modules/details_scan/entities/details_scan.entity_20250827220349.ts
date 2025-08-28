import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { ShardEntity } from 'src/common/entity/BaseEntity';
import { CheckIn } from 'src/modules/check_in/entities/check_in.entity';
@Entity('details_scan')
export class DetailsScan extends ShardEntity {

    @PrimaryGeneratedColumn()
    id: number;

    company
amount
CheckIn_id
}
