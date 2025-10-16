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

    // ตรวจสอบ entertainment
    let entertainments: Entertainment[] = [];
    if (dto.entertainmentIds?.length) {
      entertainments = await this.entertainmentRepo.findBy({
        id: In(dto.entertainmentIds),
      });
      if (entertainments.length !== dto.entertainmentIds.length)
        throw new NotFoundException('Some entertainments not found');
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

    // 🔹 ถ้ามี startDate & endDate → loop หลายวัน
    if (dto.startDate && dto.endDate) {
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);
      const concertsToSave: Concert[] = [];


      if (startDate > endDate)
        throw new BadRequestException('startDate must be before endDate');

      const dayMap: Record<string, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const excludedDays =
        dto.excludeDays?.map((d) => (typeof d === 'string' ? dayMap[d] : d)) ||
        [];

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const day = d.getDay();
        const dateStr = d.toISOString().split('T')[0];

        // ❌ ข้ามวันที่อยู่ใน excludeDays
        if (excludedDays.includes(day)) continue;

        // ❌ ห้ามสร้างย้อนหลัง
        const concertDate = new Date(dateStr);
        concertDate.setHours(0, 0, 0, 0);
        if (concertDate < today) continue;

        // ❌ ตรวจว่ามี concert ซ้ำในเวลานี้ไหม
        const exists = await this.concertRepo
          .createQueryBuilder('concert')
          .where('concert.date = :date', { date: dateStr })
          .andWhere('concert.venueId = :venueId', { venueId: dto.venueId })
          .andWhere(
            'concert.startTime < :endTime AND concert.endTime > :startTime',
            {
              startTime: dto.startTime,
              endTime: dto.endTime,
            },
          )
          .getOne();

        if (exists) continue; // ถ้ามีอยู่แล้วให้ข้ามวันนั้น

        const concert = this.concertRepo.create({
          startTime: dto.startTime,
          endTime: dto.endTime,
          price: dto.price,
          limit: dto.limit,
          date: dateStr,
          status: dto.status ?? EnumConcertStatus.OPEN,
          venue,
          entertainments,
        });

        concertsToSave.push(concert);
      }
      // console.log(concertsToSave);
      if (!concertsToSave.length)
        throw new BadRequestException('No valid concerts to create');

      return this.concertRepo.save(concertsToSave);
    }

    // 🔹 กรณีสร้างวันเดียว (เหมือนเดิม)
    if (!dto.date) throw new BadRequestException('Date is required');

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
      status: dto.status ?? EnumConcertStatus.OPEN,
      venue,
      entertainments,
    });

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

    const result = await paginateUtil(qb, query,'date');

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
    const concert = await this.concertRepo.findOne({ where: { id } });
    if (!concert) throw new NotFoundException('Concert not found');

    try {
      await this.concertRepo.remove(concert);
      return { message: 'Concert deleted successfully' };
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new BadRequestException(
          'Cannot delete concert because it has existing bookings.',
        );
      }
      throw error;
    }
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
    const status =
      concert.status === EnumConcertStatus.OPEN
        ? EnumConcertStatus.CLOSE
        : EnumConcertStatus.OPEN;
    const result = await this.concertRepo.update(id, { status });
    if (result.affected === 0) throw new NotFoundException('Concert not found');
    return { message: 'Status changed successfully' };
  }
}
