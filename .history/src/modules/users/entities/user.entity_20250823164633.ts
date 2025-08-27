import { Exclude } from "class-transformer";
import { ShardEntity } from "src/common/entity/BaseEntity";
import { Company } from "src/modules/companies/entities/company.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne ,OneToMany} from "typeorm";
import { Booking } from "src/modules/booking/entities/booking.entity";
export enum EnumRole {
    COMPANY = 'company',
    ADMIN = 'admin'
}
@Entity()
export class User extends ShardEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Exclude() 
    @Column()
    password: string;

    @Column({ unique: true })
    email: string

    @Column()
    phone: string

    @Column({ default: EnumRole.COMPANY })
    role: EnumRole

    @ManyToOne(()=> Company, company => company.user)
    companies: Company

   @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
