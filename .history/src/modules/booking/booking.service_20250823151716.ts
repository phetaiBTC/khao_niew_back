import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

/*************  ✨ Windsurf Command 🌟  *************/
  findAll() {
    return `This action returns all booking`;
  }
/*******  af3dbccc-4973-4202-a1cf-60524650d516  *******/

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
