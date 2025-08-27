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
import type  { ITransactionManager } from 'src/common/transaction/transaction.interface';
@Injectable()
export class BookingService {

  constructor(
     @InjectDataSource() private readonly dataSource: DataSource,
        @Inject(TRANSACTION_MANAGER_SERVICE)
        private readonly transactionManagerService: ITransactionManager,
        @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
  try {
    const result = await this.transactionManagerService.runInTransaction(
      this.dataSource,
      async (manager) => {
        console.log('Creating payment...');

        // use nested DTO
        const payment = await manager.create(Payment,{
          amount: createBookingDto.amount,
          payment_date: createBookingDto.payment_date,
          status: createBookingDto.status
        })
         const savedPayment = await manager.save(Payment, payment);

        console.log('Payment created:', payment);

        console.log('Creating booking...');
        const payment = await manager.create(Booking,{})
        const booking = await manager.getRepository(Booking).save({
          ticket_quantity: createBookingDto.ticket_quantity,
          unit_price: createBookingDto.unit_price,
          total_amount: createBookingDto.total_amount,
          booking_date: createBookingDto.booking_date,
          user: { id: createBookingDto.user },
          concert: { id: createBookingDto.concert },
          payment,
        });

        console.log('Booking created:', booking);

        return { booking, payment };
      }
    );

    return result;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
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
