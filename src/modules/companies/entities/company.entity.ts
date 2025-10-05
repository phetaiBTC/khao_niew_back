import { ShardEntity } from "src/common/entity/BaseEntity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Company extends ShardEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name:string

    @OneToMany(() => User, (user) => user.companies)
    user: User[]

    @Column({ nullable: true })
    contact: string

}
