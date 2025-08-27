import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Concert } from '../../concerts/entities/concert.entity';
import {}
@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @OneToOne(() => Payment, payment => payment.booking)
  payment: Payment;

  @ManyToOne(() => Concert)
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;
  
  @Column({ type: 'int' })
  ticket_quantity: number;

  @Column({ type: 'float' })
  unit_price: number;

  @Column({ type: 'float' })
  total_amount: number;

  @Column({ type: 'datetime' })
  booking_date: Date;
}
