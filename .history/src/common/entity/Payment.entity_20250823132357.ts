import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from './Booking.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'datetime' })
  payment_date: Date;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;
}
