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
      paymd=ent: Payment;
    @Column({ type: 'timestamp' })
    date_scan: Date;
}
