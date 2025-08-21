import { ShardEntity } from "src/common/entity/BaseEntity";
import { Company } from "src/modules/companies/entities/company.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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
}
