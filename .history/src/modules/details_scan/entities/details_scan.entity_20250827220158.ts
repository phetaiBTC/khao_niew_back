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
@Entity('details_scan')
export class DetailsScan extends ShardEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ticket_quantity: number;

    @Column()
    unit_price: number;

    @Column()
    total_amount: number;

    @CreateDateColumn()
    date_scan: Date;
}
