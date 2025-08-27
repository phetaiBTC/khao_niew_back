import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { ShardEntity } from 'src/common/entity/BaseEntity';

@Entity('bookingD')
export class Booking extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  concert 


}
