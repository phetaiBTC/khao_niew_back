import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Concert } from './';

@Entity('check_in')
export class CheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Concert, { unique: true })
  @JoinColumn({ name: 'concert_id' })
  concert: Concert;

  @Column({ type: 'date' })
  date_scan: Date;
}