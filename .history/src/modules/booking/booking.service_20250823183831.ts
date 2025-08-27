import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {Booking} from "./entities/booking.entity";
import {Payment} from "../payment/entities/payment.entity";
import {Concert} from "../concerts/entities/concert.entity";
import {User} from "../users/entities/user.entity";
import { Repository ,DataSource } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import { ITransactionManager } from 'src/common/transaction/transaction.interface';
@Injectable()
export class BookingService {

  constructor(
    private readonly bookingRepo: Repository<Booking>,
     @InjectDataSource() private readonly dataSource: DataSource,
        @Inject(TRANSACTION_MANAGER_SERVICE)
        private readonly transactionManagerService: ITransactionManager,
        @InjectRepository(StudentEntity) private readonly studentRepository: Repository<StudentEntity>,
  ) {}
  create(createBookingDto: CreateBookingDto) {
    // const newBooking = {
    //   ticketQuantity: createBookingDto.ticket_quantity,
    //   unitPrice: createBookingDto.unit_price,
    //   totalAmount: createBookingDto.total_amount,
    //   bookingDate: createBookingDto.booking_date,
    //   userId: createBookingDto.usersId,
    // };

    // // Save the new booking to the database (e.g. using a repository or service)
    // // For this example, we'll just log the new booking to the console
    // console.log('New booking created:', newBooking);

    // // Return a success response
    // return {
    //   message: 'Booking created successfully',
    //   data: newBooking,
    // };
    return 'This action adds a new booking';
  }

  findAll() {
    return `This action returns all booking`;
  }

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
