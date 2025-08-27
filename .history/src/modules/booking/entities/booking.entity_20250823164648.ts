import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Concert } from '../../concerts/entities/concert.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';
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

  @Column({ type: 'datetime' })
  booking_date: Date;

  @ManyToOne(() => User, (user) => user.id)
  userId: User;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;

  @ManyToOne(() => Concert, (concert) => concert.bookings)
  concert: Concert;
}
