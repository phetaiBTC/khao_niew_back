import { mapImage } from 'src/modules/images/mapper/images.mapper';
import { Entertainment } from '../entities/entertainment.entity';
import { Image } from 'src/modules/images/entities/image.entity';

export function mapEntertainment(entertainment: Entertainment): Entertainment {
  return Object.assign(new Entertainment(), {
    id: entertainment.id,
    title: entertainment.title,
    description: entertainment.description,
    createdAt: entertainment.created_At,
    updatedAt: entertainment.updated_At,
    images: entertainment.images?.map((img: Image) => mapImage(img)),
    // concerts: entertainment.concerts,
  });
}
