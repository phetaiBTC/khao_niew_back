import { create } from 'domain';
import { Concert } from '../entities/concert.entity';
import { mapVenue } from 'src/modules/venue/mapper/venue.mapper';
import { mapEntertainment } from 'src/modules/entertainments/mapper/entertainments.mapper';
import { Entertainment } from 'src/modules/entertainments/entities/entertainment.entity';

export function mapConcert(concert: Concert, totalTicket?: number) {
  return {
    id: concert.id,
    startTime: concert.startTime,
    endTime: concert.endTime,
    price: concert.price,
    limit: concert.limit,
    date: concert.date,
    status: concert.status,
    totalTicket: totalTicket || 0,
    createdAt: concert.created_At,
    updatedAt: concert.updated_At,
    venue: concert.venue ? mapVenue(concert.venue) : null,
    entertainments: concert.entertainments
      ? concert.entertainments.map((e: Entertainment) => mapEntertainment(e))
      : [],
  };
}
