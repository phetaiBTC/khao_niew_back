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

    @Column({ type: 'timestamp' })
    date_scan: Date;
}
