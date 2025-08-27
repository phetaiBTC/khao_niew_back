import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './Company.entity';
import { CheckIn } from './CheckIn.entity';

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