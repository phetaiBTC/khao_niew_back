import { mapImage } from 'src/modules/images/mapper/images.mapper';
import { Venue } from '../entities/venue.entity';
import { Image } from 'src/modules/images/entities/image.entity';

// export interface VenueModule {
//     id: number;
//     name: string;
//     address: string;
//     latitude: number;
//     longitude: number;
//     created_At: Date;
//     updated_At: Date;
//     images: Image[];
// }

export function mapVenue(venue: Venue): Venue {
  return Object.assign(new Venue(), {
    id: venue.id,
    name: venue.name,
    address: venue.address,
    latitude: venue.latitude,
    longitude: venue.longitude,
    createdAt: venue.created_At,
    updatedAt: venue.updated_At,
    images: venue.images ? venue.images.map((img: Image) => mapImage(img)) : [],
    // concerts: venue.concerts,
  });
}
