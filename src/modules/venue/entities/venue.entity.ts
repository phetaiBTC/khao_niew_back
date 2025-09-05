import { ShardEntity } from 'src/common/entity/BaseEntity';
import { Concert } from 'src/modules/concerts/entities/concert.entity';
import { Image } from 'src/modules/images/entities/image.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Venue extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @ManyToMany(() => Image, (image) => image.venues)
  @JoinTable({ name: 'venue_images' })
  images: Image[];

  @OneToMany(() => Concert, (concert) => concert.venue)
  concerts: Concert[];
}
