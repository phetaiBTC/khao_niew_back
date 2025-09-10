import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { CheckIn } from 'src/modules/check_in/entities/check_in.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';
import { DetailsStatus } from 'src/modules/booking-details/entities/bookingDetails.entity';
@Entity('bookingdetail')
export class BookingDetail extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Booking, (booking) => booking.details)
  booking: Booking;

   @OneToOne(() => CheckIn, (checkin) => checkin.booking_details)
  check_in: CheckIn;

    @Column({ type: 'enum', enum: DetailsStatus , default: DetailsStatus.NOT_CHECKED_IN })
    status: DetailsStatus;
}
