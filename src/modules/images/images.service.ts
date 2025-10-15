// src/modules/images/image.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Image } from './entities/image.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Entertainment } from '../entertainments/entities/entertainment.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import {
  fileExists,
  removeFile,
} from 'src/common/interceptors/upload-image.interceptor';
import { join } from 'path';
import { mapImage } from './mapper/images.mapper';
import { UploadService } from './upload.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,

    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,

    @InjectRepository(Entertainment)
    private readonly entertainmentRepo: Repository<Entertainment>,

    private readonly uploadService: UploadService,
  ) {}

  async createMany_server(files: Array<{ key: string; }>) {
    const images = files.map((f) =>
      this.imageRepo.create({ key: f.key}),
    );
    return this.imageRepo.save(images);
  }
    async createMany(dto: CreateImageDto, urls: string[]) {
    const images = urls.map((url) => this.imageRepo.create({ url }));

    if (dto.venueIds?.length) {
      const venues = await this.venueRepo.findBy({ id: In(dto.venueIds) });
      images.forEach((img) => (img.venues = venues));
    }

    if (dto.entertainmentIds?.length) {
      const entertainments = await this.entertainmentRepo.findBy({
        id: In(dto.entertainmentIds),
      });
      images.forEach((img) => (img.entertainments = entertainments));
    }

    return this.imageRepo.save(images); // save หลาย record ได้
  }
  async remove(id: number) {
    const image = await this.findOne(id);
    if (!image) throw new Error('Image not found');
    const filePath = join(process.cwd(), image.url.replace(/^\//, ''));

    if (await fileExists(filePath)) {
      await removeFile(filePath);
    }

    await this.imageRepo.remove(image);

    return { message: 'Image removed successfully' };
  }

  async findAll(): Promise<Image[]> {
    const images = await this.imageRepo.find({
      relations: ['venues', 'entertainments'],
    });
    // console.log(images);
    return images.map((img) => mapImage(img));
  }

  async findOne(id: number) {
    const image = await this.imageRepo.findOne({
      where: { id },
      relations: ['venues', 'entertainments'],
    });
    if (!image) throw new NotFoundException('Image not found');
    return mapImage(image);
  }

  async update(id: number, dto: UpdateImageDto, url: string) {
    const image = await this.findOne(id);

    if (dto.venueIds) {
      const venues = await this.venueRepo.findBy({ id: In(dto.venueIds) });
      image.venues = venues;
    }

    if (dto.entertainmentIds) {
      const entertainments = await this.entertainmentRepo.findBy({
        id: In(dto.entertainmentIds),
      });
      image.entertainments = entertainments;
    }

    if (url) image.url = url;

    return this.imageRepo.save(image);
  }

  async remove_server(id: number) {
    const image = await this.findOne(id);
    if (!image) throw new Error('Image not found');

    const fileExists = await this.uploadService.deleteFile(image.key);
    if (!fileExists) throw new NotFoundException('File does not exist'); 
    await this.imageRepo.remove(image);

    return { message: 'Image removed successfully' };
  }
}
