import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../';
import { CheckIn } from '../../check_in/entities/check_in.entity';

@Entity('details_scan')
export class DetailsScan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company' })
  company: Company;

  @Column({ type: 'int' })
  amount: number;

  @ManyToOne(() => CheckIn)
  @JoinColumn({ name: 'CheckIn_id' })
  checkIn: CheckIn;
}