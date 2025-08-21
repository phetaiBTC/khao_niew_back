import { ShardEntity } from 'src/common/entity/BaseEntity';
import { Entertainment } from 'src/modules/entertainments/entities/entertainment.entity';
import { Venue } from 'src/modules/venue/entities/venue.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class Image extends ShardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToMany(() => Venue, (venue) => venue.images)
  venues: Venue[];

  @ManyToMany(() => Entertainment, (entertainment) => entertainment.images)
  entertainments: Entertainment[];
}
