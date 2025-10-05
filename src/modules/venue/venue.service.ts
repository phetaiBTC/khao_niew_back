// src/modules/venue/venue.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Or, Repository } from 'typeorm';
import { Venue } from './entities/venue.entity';
import { Image } from '../images/entities/image.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { In } from 'typeorm';
import { OrderBy, PaginateDto } from 'src/common/dto/paginate.dto';
import { paginateUtil } from 'src/common/utils/paginate.util';
import { Pagination } from 'src/common/interface/pagination.interface';
import { mapVenue } from './mapper/venue.mapper';

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

    if (await this.venueRepo.findOne({ where: { name: dto.name } })) {
      throw new NotFoundException('Venue name already exists');
    }

    if (dto.imageIds && dto.imageIds.length > 0) {
      const images = await this.imageRepo.find({
        where: { id: In(dto.imageIds) },
      });
      venue.images = images;
    }
    const result = this.venueRepo.save(venue);
    return result;
  }

  async findAll(query: PaginateDto): Promise<Pagination<Venue>> {
    const qb = this.venueRepo.createQueryBuilder('venue');
    qb.leftJoinAndSelect('venue.images', 'images');
    qb.leftJoinAndSelect('venue.concerts', 'concerts');
    if (query.search) {
      qb.where('venue.name LIKE :search', {
        search: `%${query.search}%`,
      });
    }
    qb.orderBy('venue.createdAt', query.order_by ? query.order_by : 'DESC');

    const result = await paginateUtil(qb, query);

    const formatedData = result.data.map((venue) => mapVenue(venue));

    return {
      ...result,
      data: formatedData,
    };
  }

  async findOne(id: number) : Promise<Venue> {
    const venue = await this.venueRepo.findOne({
      where: { id },
      relations: ['images', 'concerts'],
    });
    if (!venue) throw new NotFoundException('Venue not found');
    return mapVenue(venue);
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
