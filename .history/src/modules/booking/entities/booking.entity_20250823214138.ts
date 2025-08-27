import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Concert } from '../../concerts/entities/concert.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';
import { dayjsUtil } from 'src/common/utils/dayjs.util';
import { Exclude } from 'class-transformer';
@Entity('booking')
export class Booking extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  ticket_quantity: number;

  @Column({ type: 'float' })
  unit_price: number;

  @Column({ type: 'float' })
  total_amount: number;


 @CreateDateColumn()
  booking_date: Date;

 @ManyToOne(() => User, (user) => user.bookings)
user: User;

@OneToOne(() => Payment, { cascade: true })
@JoinColumn()
payment: Payment;

@ManyToOne(() => Concert, (concert) => concert.bookings)
concert: Concert;

 @Exclude()
 get booking_Date(): string {
        return dayjsUtil(this.booking_date);
    }
}
