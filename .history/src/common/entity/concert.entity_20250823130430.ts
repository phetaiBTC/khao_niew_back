import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Venue } from '../../venue/entities/venue.entity';

export enum ConcertStatus {
  OPEN = 'open',
  CLOSE = 'close',
  SOLD_OUT = 'sold_out',
}

@Entity('concert')
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  // entertainment_id can be added here if needed as a relation

  @Column({ type: 'varchar', length: 50 })
  start_time: string;

  @Column({ type: 'varchar', length: 50 })
  end_time: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  limit: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'enum', enum: ConcertStatus })
  status: ConcertStatus;

  @ManyToOne(() => Venue)
  @JoinColumn({ name: 'venue' })
  venue: Venue;
}