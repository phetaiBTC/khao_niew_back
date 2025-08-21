import { ShardEntity } from "src/common/entity/BaseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Entertainment extends ShardEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string
}
