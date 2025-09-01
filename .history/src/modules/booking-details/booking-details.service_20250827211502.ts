import { Injectable, NotFoundException } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
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
      async getBookingDetails(query: PaginateDto) {
        const qb = this.bookingDetailRepository
          .createQueryBuilder('bookingDetail')
          .leftJoinAndSelect('bookingDetail.booking', 'booking')
          .leftJoinAndSelect('booking.concert', 'concert')
          .leftJoinAndSelect('booking.user', 'user')
          .leftJoinAndSelect('booking.payment', 'payment');

        // Search by concert ID
        if (query.search) {
          qb.where('concert.id = :concertId', {
            concertId: query.search
          });
        }

        // Add ordering by booking date desc
        qb.orderBy('booking.booking_date', 'DESC');

        return paginateUtil(qb, query);
      }
}
