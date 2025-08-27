import { ShardEntity } from 'src/common/entity/BaseEntity';
import { Entertainment } from 'src/modules/entertainments/entities/entertainment.entity';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Venue } from 'src/modules/venue/entities/venue.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Man
} from 'typeorm';

export enum EnumConcertStatus {
  OPEN = 'open',
  CLOSE = 'close',
  SOLD_OUT = 'sold_out',
}
@Entity()
export class Concert extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column('int')
  price: number;

  @Column('int')
  limit: number;

  @Column('date')
  date: string;

  @Column({ type: 'enum', enum: EnumConcertStatus, default: EnumConcertStatus.OPEN })
  status: EnumConcertStatus;

  @ManyToMany(() => Entertainment, (entertainment) => entertainment.concerts)
  @JoinTable({ name: 'concert_entertainment' })
  entertainments: Entertainment[];

  @ManyToOne(() => Venue, (venue) => venue.concerts)
  venue: Venue;

  
  @ManyToMany(() => Booking, booking => booking.concerts)
  bookings: Booking[];
}

