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


 get bookingdate(): string {
        return dayjsUtil(this.booking_date);
    }
}
