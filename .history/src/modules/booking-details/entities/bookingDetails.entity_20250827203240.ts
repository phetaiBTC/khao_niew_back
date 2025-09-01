import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('bookingdetail')
export class BookingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.details)
  booking: Booking;
  // Add more fields as needed, e.g. seat number, ticket code, etc.
}
