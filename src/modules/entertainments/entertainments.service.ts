import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Entertainment } from './entities/entertainment.entity';
import { Image } from '../images/entities/image.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { CreateEntertainmentDto } from './dto/create-entertainment.dto';
import { UpdateEntertainmentDto } from './dto/update-entertainment.dto';

@Injectable()
export class EntertainmentsService {
  constructor(
    @InjectRepository(Entertainment) private entRepo: Repository<Entertainment>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
    @InjectRepository(Concert) private concertRepo: Repository<Concert>,
  ) {}

  async create(dto: CreateEntertainmentDto) {
    const ent = this.entRepo.create({ title: dto.title, description: dto.description });

    if (dto.imageIds?.length) {
      const images = await this.imageRepo.findBy({ id: In(dto.imageIds) });
      ent.images = images;
    }

    if (dto.concertIds?.length) {
      const concerts = await this.concertRepo.findBy({ id: In(dto.concertIds) });
      ent.concerts = concerts;
    }

    return this.entRepo.save(ent);
  }

  async findAll() {
    return this.entRepo.find({ relations: ['images', 'concerts'] });
  }

  async findOne(id: number) {
    const ent = await this.entRepo.findOne({ where: { id }, relations: ['images', 'concerts'] });
    if (!ent) throw new NotFoundException('Entertainment not found');
    return ent;
  }

  async update(id: number, dto: UpdateEntertainmentDto) {
    const ent = await this.findOne(id);

    if (dto.title) ent.title = dto.title;
    if (dto.description) ent.description = dto.description;

    if (dto.imageIds) {
      const images = await this.imageRepo.findBy({ id: In(dto.imageIds) });
      ent.images = images;
    }

    if (dto.concertIds) {
      const concerts = await this.concertRepo.findBy({ id: In(dto.concertIds) });
      ent.concerts = concerts;
    }

    return this.entRepo.save(ent);
  }

  async remove(id: number) {
    const ent = await this.findOne(id);
    return this.entRepo.remove(ent);
  }
}
