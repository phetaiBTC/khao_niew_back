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
@Entity('details_scan')
export class DetailsScan {}
