import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

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

  @OneToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'datetime' })
  payment_date: Date;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;
}