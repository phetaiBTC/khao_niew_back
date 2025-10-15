import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Concert, EnumConcertStatus } from './entities/concert.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Entertainment } from '../entertainments/entities/entertainment.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { timeToNumber } from 'src/common/utils/timeToNumber';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { paginateUtil } from 'src/common/utils/paginate.util';
import { Pagination } from 'src/common/interface/pagination.interface';
import { Booking } from '../booking/entities/booking.entity';
import { mapConcert } from './mapper/concerts.mapper';
import { PaymentStatus } from '../payment/entities/payment.entity';
import { calculateTotalTickets } from 'src/common/utils/calculateTotalTickets';
@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert) private concertRepo: Repository<Concert>,
    @InjectRepository(Venue) private venueRepo: Repository<Venue>,
    @InjectRepository(Entertainment)
    private entertainmentRepo: Repository<Entertainment>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
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

    const concert_exists = await this.concertRepo
      .createQueryBuilder('concert')
      .where('concert.date = :date', { date: dto.date })
      .andWhere('concert.venueId = :venueId', { venueId: dto.venueId })
      .andWhere(
        'concert.startTime < :endTime AND concert.endTime > :startTime',
        {
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
      )
      .getOne();

    if (concert_exists) {
      throw new BadRequestException(
        'A concert is already scheduled at this venue during the specified time',
      );
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

  async findAll(query: PaginateDto) {
    const qb = this.concertRepo.createQueryBuilder('concert');
    qb.leftJoinAndSelect('concert.venue', 'venue');
    qb.leftJoinAndSelect('concert.entertainments', 'entertainments');
    qb.leftJoinAndSelect('entertainments.images', 'images');
    qb.leftJoinAndSelect('concert.bookings', 'bookings');
    qb.leftJoinAndSelect('bookings.payment', 'payments');

    if (query.search) {
      qb.where('concert.date LIKE :search', { search: `%${query.search}%` });
    }

    const result = await paginateUtil(qb, query);

    const formattedData = result.data.map((concert) => {
      const total_ticket = calculateTotalTickets(concert);
      return mapConcert(concert, total_ticket);
    });
    return { ...result, data: formattedData };
  }

  async findOne(id: number) {
    const concert = await this.concertRepo

      .createQueryBuilder('concert')
      .leftJoinAndSelect('concert.venue', 'venue')
      .leftJoinAndSelect('concert.entertainments', 'entertainments')
      .leftJoinAndSelect('entertainments.images', 'images')
      .leftJoinAndSelect('concert.bookings', 'bookings')
      .leftJoinAndSelect('bookings.payment', 'payments')

      .where('concert.id = :id', { id })
      .getOne();

    if (!concert) throw new NotFoundException('Concert not found');

    const total_ticket = calculateTotalTickets(concert);

    return mapConcert(concert, total_ticket);
  }

  async update(id: number, dto: UpdateConcertDto) {
    const concert = await this.concertRepo.findOne({
      where: { id },
      relations: ['entertainments', 'venue'],
    });
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
    const concerts = await this.concertRepo.findBy({ id });
    return this.concertRepo.remove(concerts);
  }

  async concertsProfile(concertId: number) {
    const concert = await this.concertRepo
      .createQueryBuilder('concert')
      .leftJoinAndSelect('concert.venue', 'venue')
      .leftJoinAndSelect('concert.entertainments', 'entertainments')
      .leftJoinAndSelect('entertainments.images', 'images')
      .where('concert.id = :id', { id: concertId })
      .getOne();

    if (!concert) return null;
    const result = await this.concertRepo
      .createQueryBuilder('concert')
      .leftJoin('concert.bookings', 'booking')
      .leftJoin('booking.user', 'user')
      .leftJoin('user.companies', 'companies')
      .leftJoin('booking.payment', 'payment')
      .leftJoin('concert.venue', 'venue')
      .addSelect('concert.id', 'concert_id')
      .addSelect('venue.id', 'venue_id')
      .addSelect('venue.name', 'venue_name')
      .addSelect('companies.id', 'company_id')
      .addSelect('companies.name', 'company_name')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .addSelect('SUM(booking.ticket_quantity)', 'total_people')
      .addSelect('COUNT(DISTINCT companies.id)', 'total_companies')
      .addSelect(
        'SUM(booking.unit_price * booking.ticket_quantity)',
        'total_revenue',
      )
      .where('concert.id = :concertId', { concertId })
      .andWhere('payment.status != :status', { status: PaymentStatus.FAILED })
      .andWhere('companies.id IS NOT NULL')
      .groupBy('concert.id')
      .addGroupBy('companies.id')
      .addGroupBy('venue.id')
      .orderBy('total_revenue', 'DESC')
      .getRawMany();

    // เตรียมข้อมูล concert
    const concertInfo = {
      id: concert.id,
      date: concert.date,
      price: Number(concert.price),
      limit: Number(concert.limit),
      status: concert.status,
      startTime: concert.startTime,
      endTime: concert.endTime,
      entertainments: concert.entertainments,
      venue: concert.venue
        ? {
            id: concert.venue.id,
            name: concert.venue.name,
            address: concert.venue.address,
            latitude: concert.venue.latitude,
            longitude: concert.venue.longitude,
          }
        : null,
    };

    if (result.length === 0) {
      return {
        concert: concertInfo,
        companies: [],
        total_companies: 0,
        summary: {
          total_companies: 0,
          total_revenue: 0,
        },
      };
    }

    const totalRevenue = result.reduce(
      (sum, r) => sum + Number(r.total_revenue || 0),
      0,
    );

    const companies = result.map((r) => ({
      id: r.company_id,
      name: r.company_name,
      total_bookings: Number(r.total_bookings || 0),
      total_people: Number(r.total_people || 0),
      total_revenue: Number(r.total_revenue || 0),
    }));

    return {
      concert: concertInfo,
      companies,
      summary: {
        total_companies: companies.length,
        total_revenue: totalRevenue,
      },
    };
  }

  async changeStatus(id: number) {
    const concert = await this.findOne(id);
    const status = concert.status === EnumConcertStatus.OPEN ? EnumConcertStatus.CLOSE : EnumConcertStatus.OPEN;
    const result = await this.concertRepo.update(id, { status });
    if (result.affected === 0) throw new NotFoundException('Concert not found');
    return { message : "Status changed successfully"};
  }
}
