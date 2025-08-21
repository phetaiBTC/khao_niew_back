// src/modules/venue/venue.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { Image } from '../images/entities/image.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { In } from 'typeorm';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,

    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) {}

  async create(dto: CreateVenueDto) {
    const venue = this.venueRepo.create(dto);

    if (dto.imageIds && dto.imageIds.length > 0) {
      const images = await this.imageRepo.find({
        where: { id: In(dto.imageIds) },
      });
      venue.images = images;
    }

    return this.venueRepo.save(venue);
  }

  findAll() {
    return this.venueRepo.find({ relations: ['images', 'concerts'] });
  }

  async findOne(id: number) {
    const venue = await this.venueRepo.findOne({
      where: { id },
      relations: ['images', 'concerts'],
    });
    if (!venue) throw new NotFoundException('Venue not found');
    return venue;
  }

  async update(id: number, dto: UpdateVenueDto) {
    const venue = await this.findOne(id);

    if (dto.imageIds) {
      const images = await this.imageRepo.find({
        where: { id: In(dto.imageIds) },
      });
      venue.images = images;
    }

    Object.assign(venue, dto);
    return this.venueRepo.save(venue);
  }

  async remove(id: number) {
    const venue = await this.findOne(id);
    return this.venueRepo.remove(venue);
  }
}
