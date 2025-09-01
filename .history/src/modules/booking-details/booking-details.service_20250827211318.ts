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
      async getBookingDetails(query : PaginateDto) {
        const qb = this.bookingDetailRepository.createQueryBuilder('bookingDetail');
        if (query.search) {
          qb.where('bookingDetail.bookingId = :search', {
            search: `%${query.search}%`,
          });
        }
        return paginateUtil(qb, query);
      }
}
