import { Injectable, NotFoundException } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { BookingDetail } from './entities/bookingDetails.entity';
import * as crypto from 'crypto';

@Injectable()
export class BookingDetailsService {

      constructor(
        @InjectRepository(BookingDetail)
        private readonly bookingDetailRepository: Repository<BookingDetail>,
      ) {}
   
}
