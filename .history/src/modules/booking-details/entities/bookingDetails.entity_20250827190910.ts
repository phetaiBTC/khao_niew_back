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
  
  @Column({ nullable: true })
  qr_code: string;

  @Column({ type: 'varchar', unique: true })
  ticket_code: string;
  // Add more fields as needed, e.g. seat number, ticket code, etc.
}
