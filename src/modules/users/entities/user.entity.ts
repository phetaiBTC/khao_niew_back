import { ShardEntity } from "src/common/entity/BaseEntity";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
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
}
