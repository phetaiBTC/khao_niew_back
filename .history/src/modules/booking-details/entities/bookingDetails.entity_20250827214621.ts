import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import {}
@Entity('bookingdetail')
export class BookingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.details)
  booking: Booking;

   @OneToOne(() => CheckIn, (CheckIn) => booking.payment)
    check_in: CheckIn;
}
