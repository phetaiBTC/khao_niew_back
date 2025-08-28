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
export class CheckIn {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => Payment, { cascade: true })
      @JoinColumn()
      booking: Payment;
    @Column({ type: 'timestamp' })
    date_scan: Date;
}
