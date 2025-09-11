import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { CheckIn } from 'src/modules/check_in/entities/check_in.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CHECKED_IN = 'checked_in',
  NO
}
@Entity('bookingdetail')
export class BookingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.details)
  booking: Booking;

   @OneToOne(() => CheckIn, (checkin) => checkin.booking_details)
  check_in: CheckIn;

  @Column({ type: 'boolean', default: false })
  status: boolean;
}
