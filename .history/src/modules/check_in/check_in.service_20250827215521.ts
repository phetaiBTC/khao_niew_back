import { Injectable } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check_in.dto';
import { UpdateCheckInDto } from './dto/update-check_in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckIn } from './entities/check_in.entity';
import { Repository } from 'typeorm';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn)
    private checkInRepository: Repository<CheckIn>,
    @InjectRepository(BookingDetail)
    private bookingDetailRepository: Repository<BookingDetail>,
  ) {}
  async create(createCheckInDto: CreateCheckInDto) {
      try {
         const 

        return `This action adds a new checkIn`;
      } catch (error) {
        console.log(error);
        throw error;
      }

  }

  findAll() {
    return `This action returns all checkIn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkIn`;
  }

  update(id: number, updateCheckInDto: UpdateCheckInDto) {
    return `This action updates a #${id} checkIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkIn`;
  }
}
