import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';
import { Image } from 'src/modules/images/entities/image.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  // REFUNDED = 'refunded',
}

@Entity('payment')
export class Payment extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  booking: Booking;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  payment_date: Date;

  @Column({ type: 'enum', enum: PaymentStatus , default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ManyToMany(() => Image, im => im.payments)
  @JoinTable({ name: 'payment_images' })
  images: Image[];
}