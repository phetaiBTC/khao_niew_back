import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { Concert } from 'src/modules/concerts/entities/concert.entity';
import { Image } from 'src/modules/images/entities/image.entity';
import { ShardEntity } from 'src/common/entity/BaseEntity';

@Entity()
export class Entertainment extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Concert, ce => ce.entertainments)
  concerts: Concert[];

  @ManyToMany(() => Image, im => im.entertainments)
  @JoinTable({ name: 'entertainment_images' })
  images: Image[]
}
