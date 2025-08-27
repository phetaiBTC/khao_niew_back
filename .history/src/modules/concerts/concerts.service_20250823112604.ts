import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Concert } from './entities/concert.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Entertainment } from '../entertainments/entities/entertainment.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { timeToNumber } from 'src/common/utils/timeToNumber';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert) private concertRepo: Repository<Concert>,
    @InjectRepository(Venue) private venueRepo: Repository<Venue>,
    @InjectRepository(Entertainment)
    private entertainmentRepo: Repository<Entertainment>,
  ) {}

  async create(dto: CreateConcertDto) {
    const venue = await this.venueRepo.findOne({ where: { id: dto.venueId } });
    if (!venue) throw new NotFoundException('Venue not found');

    if (dto.entertainmentIds?.length) {
      const entertainments = await this.entertainmentRepo.findBy({
        id: In(dto.entertainmentIds),
      });
      if (entertainments.length !== dto.entertainmentIds.length)
        throw new NotFoundException('Entertainment not found');
    }
    const start = timeToNumber(dto.startTime);
    const end = timeToNumber(dto.endTime);

    if (start >= end) {
      throw new BadRequestException(
        'Start time should be earlier than end time',
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const concertDate = new Date(dto.date);
    concertDate.setHours(0, 0, 0, 0);

    if (concertDate < today) {
      throw new BadRequestException('Date must be today or in the future');
    }

    const concert = this.concertRepo.create({
      startTime: dto.startTime,
      endTime: dto.endTime,
      price: dto.price,
      limit: dto.limit,
      date: dto.date,
      status: dto.status,
      venue,
    });

    if (dto.entertainmentIds?.length) {
      const entertainments = await this.entertainmentRepo.findBy({
        id: In(dto.entertainmentIds),
      });
      concert.entertainments = entertainments;
    }

    return this.concertRepo.save(concert);
  }

  async findAll() {
    return this.concertRepo.find({ relations: ['venue', 'entertainments'] });
  }

  async findOne(id: number) {
    const concert = await this.concertRepo.findOne({
      where: { id },
      relations: ['venue', 'entertainments'],
    });
    if (!concert) throw new NotFoundException('Concert not found');
    return concert;
  }

  async update(id: number, dto: UpdateConcertDto) {
    const concert = await this.findOne(id);
    if (!concert) throw new NotFoundException('Concert not found');

    const start = timeToNumber(dto.startTime ?? '');
    const end = timeToNumber(dto.endTime ?? '');
    if (start >= end) {
      throw new BadRequestException(
        'Start time should be earlier than end time',
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const concertDate = new Date(dto.date ?? '');
    concertDate.setHours(0, 0, 0, 0);

    if (concertDate < today) {
      throw new BadRequestException('Date must be today or in the future');
    }

    if (dto.startTime) concert.startTime = dto.startTime;
    if (dto.endTime) concert.endTime = dto.endTime;
    if (dto.price) concert.price = dto.price;
    if (dto.limit) concert.limit = dto.limit;
    if (dto.date) concert.date = dto.date;
    if (dto.status) concert.status = dto.status;

    if (dto.venueId) {
      const venue = await this.venueRepo.findOne({
        where: { id: dto.venueId },
      });
      if (!venue) throw new NotFoundException('Venue not found');
      concert.venue = venue;
    }

    if (dto.entertainmentIds) {
      const entertainments = await this.entertainmentRepo.findBy({
        id: In(dto.entertainmentIds),
      });
      concert.entertainments = entertainments;
    }

    return this.concertRepo.save(concert);
  }

  async remove(id: number) {
    const concert = await this.findOne(id);
    return this.concertRepo.remove(concert);
  }
}
