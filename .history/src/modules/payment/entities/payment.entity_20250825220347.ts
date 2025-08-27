import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payment')
export class Payment extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  booking: Booking;

  @Column({ type: 'float' })
  amount: number;

}