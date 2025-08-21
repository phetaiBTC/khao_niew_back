// src/modules/venue/venue.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './entities/venue.entity';
import { Image } from '../images/entities/image.entity';
import { VenueService } from './venue.service';
import { VenueController } from './venue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, Image])],
  providers: [VenueService],
  controllers: [VenueController],
})
export class VenueModule {}
