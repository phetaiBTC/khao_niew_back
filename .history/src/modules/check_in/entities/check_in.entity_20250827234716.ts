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
import {DetailsScan} from 'src/modules/details_scan/entities/details_scan.entity'
@Entity('check_in')
export class CheckIn extends ShardEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => BookingDetail, { cascade: true })
      @JoinColumn()
    booking_details: BookingDetail;

    @CreateDateColumn()
    date_scan:  Date;

    @OneToMany(() => DetailsScan, (detailsScan) => detailsScan.check_ins)
    @JoinColumn({ name: 'details_scan_id' })
     details_scans: DetailsScan[]
    
    }
