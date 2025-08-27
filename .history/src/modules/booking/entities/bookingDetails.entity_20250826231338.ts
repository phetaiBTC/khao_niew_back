import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { ShardEntity } from 'src/common/entity/BaseEntity';

@Entity('booking')
export class Booking extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

 @ManyToOne(() => User, (user) => user.bookings)
user: User;

@OneToOne(() => Payment, { cascade: true })
@JoinColumn()
payment: Payment;

@ManyToOne(() => Concert, (concert) => concert.bookings)
concert: Concert;


}
