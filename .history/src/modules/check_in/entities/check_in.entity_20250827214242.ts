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
import { Payment } from '../../payment/entities/payment.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';
@Entity('check_in')
export class CheckIn {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => Payment, { cascade: true })
      @JoinColumn()
      booking_details: Payment;
    @Column({ type: 'timestamp' })
    date_scan: Date;
}
