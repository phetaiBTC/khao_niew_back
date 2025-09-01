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

    @CheckInedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    check_in_time: Date;

    @Column({ type: 'timestamp', nullable: true })
    check_out_time: Date | null;

    @ManyToOne(() => Booking, (booking) => booking.check_ins)
    booking: Booking;
}
