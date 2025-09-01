// src/modules/images/image.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Image } from './entities/image.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Entertainment } from '../entertainments/entities/entertainment.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';


@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,

    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,

    @InjectRepository(Entertainment)
    private readonly entertainmentRepo: Repository<Entertainment>,
  ) {}

async createMany(dto: CreateImageDto, urls: string[]) {
  const images = urls.map(url => this.imageRepo.create({ url }));

  if (dto.venueIds?.length) {
    const venues = await this.venueRepo.findBy({ id: In(dto.venueIds) });
    images.forEach(img => (img.venues = venues));
  }

  if (dto.entertainmentIds?.length) {
    const entertainments = await this.entertainmentRepo.findBy({ id: In(dto.entertainmentIds) });
    images.forEach(img => (img.entertainments = entertainments));
  }

  return this.imageRepo.save(images); // save หลาย record ได้
}

  findAll() {
    return this.imageRepo.find({ relations: ['venues', 'entertainments'] });
  }
  

  async findOne(id: number) {
    const image = await this.imageRepo.findOne({
      where: { id },
      relations: ['venues', 'entertainments'],
    });
    if (!image) throw new NotFoundException('Image not found');
    return image;
  }


  async update(id: number, dto: UpdateImageDto, url : string) {
    const image = await this.findOne(id);

    if (dto.venueIds) {
      const venues = await this.venueRepo.findBy({ id: In(dto.venueIds) });
      image.venues = venues;
    }

    if (dto.entertainmentIds) {
      const entertainments = await this.entertainmentRepo.findBy({ id: In(dto.entertainmentIds) });
      image.entertainments = entertainments;
    }

    if (url) image.url = url;

    return this.imageRepo.save(image);
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    this.imageRepo.remove(image);
    return { message : 'Image removed successfully' };
  }
}
