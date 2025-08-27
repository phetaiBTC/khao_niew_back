import { Entity, PrimaryGeneratedColumn, Column, One, JoinColumn } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

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
  
  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'datetime' })
  payment_date: Date;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;
}