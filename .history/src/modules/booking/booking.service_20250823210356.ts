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
        @InjectRepository(Concert) private readonly concertRepository: Repository<Concert>,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
  try {
     // Check if the concert exists before attempting to insert a new booking
    const concert = await this.concertRepository.findOne({ where: { id: createBookingDto.concert } });
    if (!concert) {
      throw new un(`Concert with id ${createBookingDto.concert} does not exist`);
    }
    const result = await this.transactionManagerService.runInTransaction(
      this.dataSource,
      async (manager) => {
        console.log('Creating payment...');

        // use nested DTO
        const payment =  manager.create(Payment,{
          amount: createBookingDto.payment.amount,
          payment_date: createBookingDto.payment.payment_date,
          status: createBookingDto.payment.status
        })
         const savedPayment = await manager.save(Payment, payment);

        const booking =  manager.create(Booking,{
          ticket_quantity: createBookingDto.ticket_quantity,
          unit_price: createBookingDto.unit_price,
          total_amount: createBookingDto.total_amount,
          booking_date: createBookingDto.booking_date,
          user: { id: createBookingDto.user },
          concert: { id: createBookingDto.concert },
          payment
        })
      const savedBooking = await manager.save(Booking, booking);

        console.log('Booking created:', booking);

        return { savedPayment, savedBooking };
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
