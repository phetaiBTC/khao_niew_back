import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { BookingDetail } from 'src/modules/booking-details/entities/bookingDetails.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';
@Entity('check_in')
export class CheckIn extends ShardEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => BookingDetail, { cascade: true })
      @JoinColumn()
    booking_details: Payment;

    @CreateDateColumn()
    date_scan:  Date;
}
