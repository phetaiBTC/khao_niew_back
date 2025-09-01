import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('bookingdetail')
export class BookingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.details)
  booking: Booking;

   @OneToOne(() => Booking, (booking) => booking.payment)
    booking: Booking;
}
