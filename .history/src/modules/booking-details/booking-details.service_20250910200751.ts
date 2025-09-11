import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingDetail } from './entities/bookingDetails.entity';
import * as crypto from 'crypto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { paginateUtil } from 'src/common/utils/paginate.util';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,
  ) {}
  async getBookingDetails(query: PaginateDto , userId: string) {
    try {
      console.log('Received query:', query); // Debug log

      const qb = this.bookingDetailRepository
        .createQueryBuilder('bookingDetail')
        .leftJoinAndSelect('bookingDetail.booking', 'booking')
        .leftJoinAndSelect('booking.concert', 'concert')
        .leftJoinAndSelect('booking.user', 'user')
        .leftJoinAndSelect('booking.payment', 'payment');
      
       
      // Search by concert ID if provided
      if (query.search) {
        console.log('Searching for concert ID:', query.search); // Debug log
        qb.andWhere('concert.id = :concertId', {
          concertId: parseInt(query.search, 10),
        });
        qb.and
      }

      return await paginateUtil(qb, query);
    } catch (error) {
      console.error('Error in getBookingDetails service:', error);
      throw error;
    }
  }
}
