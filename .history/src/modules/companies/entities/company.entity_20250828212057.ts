import { ShardEntity } from "src/common/entity/BaseEntity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DetailsScan } from "src/modules/details_scan/entities/details_scan.entity";

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

      @ManyToOne(() => DetailsScan, (detailsScan) => detailsScan., { nullable: true })
  @JoinColumn({ name: 'details_scan_id' })
  detailsScan: DetailsScan;
}
