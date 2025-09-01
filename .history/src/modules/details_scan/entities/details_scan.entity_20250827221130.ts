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
import { ShardEntity } from 'src/common/entity/BaseEntity';
import { CheckIn } from 'src/modules/check_in/entities/check_in.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
@Entity('details_scan')
export class DetailsScan extends ShardEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    amount: number;

    @One(() => Company, (company) => company.details_scans)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @OneToOne(() => CheckIn)
    @JoinColumn({ name: 'check_in_id' })
    check_in: CheckIn;

}
