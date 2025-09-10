import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Entertainment } from '../entertainments/entities/entertainment.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Booking } from '../booking/entities/booking.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Concert, Venue, Entertainment, Booking]) ],  
  controllers: [ConcertsController],
  providers: [ConcertsService],
})
export class ConcertsModule {}
