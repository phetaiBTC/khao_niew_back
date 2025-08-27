import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from "./entities/booking.entity";
import { Payment } from "../payment/entities/payment.entity";
import { Concert } from "../concerts/entities/concert.entity";
import { Repository, DataSource } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
import { DeepPartial } from '@nestjs/common';
@Injectable()
export class BookingService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManagerService: ITransactionManager,
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Concert) private readonly concertRepository: Repository<Concert>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
    try {
      // 1. Check if the concert exists
      const concert = await this.concertRepository.findOne({ 
        where: { id: createBookingDto.concert } 
      });
      
      if (!concert) {
        throw new NotFoundException(`Concert with id ${createBookingDto.concert} does not exist`);
      }
   
      // 2. Sum up all ticket_quantity already booked for this concert
      const { sum } = await this.bookingRepository
        .createQueryBuilder('booking')
        .select('SUM(booking.ticket_quantity)', 'sum')
        .where('booking.concert = :concert', { concert: createBookingDto.concert })
        .getRawOne();

      const currentBooked = Number(sum) || 0;

      // 3. Check if adding this booking would exceed the limit
      const totalAfterBooking = currentBooked + createBookingDto.ticket_quantity;

      if (totalAfterBooking > concert.limit) {
        throw new NotFoundException(
          `Concert with id ${createBookingDto.concert} is fully booked`,
        );
      }

      // Use transaction to ensure both booking and payment are created successfully
      const result = await this.transactionManagerService.runInTransaction(
        this.dataSource,
        async (manager) => {
          console.log('Creating payment...');

          // Create payment
          const payment = manager.create(Payment, {
            amount: createBookingDto.payment.amount
          });
          const savedPayment = await manager.save(Payment, payment);

          // Calculate total amount
          const totalAmount = createBookingDto.unit_price * createBookingDto.ticket_quantity;

          // Create booking
          const booking = manager.create(Booking, {
            ticket_quantity: Number(createBookingDto.ticket_quantity),
            unit_price: createBookingDto.unit_price,
            total_amount: totalAmount,
            user: { id: userId },
            concert: { id: createBookingDto.concert },
            payment: savedPayment
          } as DeepPartial<Booking>);

          const savedBooking = await manager.save(Booking, booking);
          console.log('Booking created:', booking);

          return { booking: savedBooking };
        }
      );

      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async findAll() {
    return this.bookingRepository.find({
      relations: ['user', 'concert', 'payment'],
      select: {
        user: {
          id: true,
          email: true,
          username: true,
          phone: true
        },
        concert: {
          id: true,    
          limit: true,      
          date: true,
          price: true
        },
        payment: {
          id: true,
          amount: true
        }
      }
    });
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'concert', 'payment'],
      select: {
        user: {
          id: true,
          email: true,
          username: true,
          phone: true
        },
        concert: {
          id: true,
          limit: true,
          date: true,
          price: true
        },
        payment: {
          id: true,
          amount: true
        }
      }
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['concert']
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // If updating ticket quantity, check concert capacity
    if (updateBookingDto.ticket_quantity) {
      const concert = await this.concertRepository.findOne({ 
        where: { id: booking.concert.id } 
      });
// const concert = await this.concertRepository.findOne({ 
//   where: { id: booking.concert.id } 
// });
      if (!concert) {
        throw new NotFoundException(`concert not found`);
      }

      // Sum up all ticket_quantity already booked for this concert excluding current booking
      const { sum } = await this.bookingRepository
        .createQueryBuilder('booking')
        .select('SUM(booking.ticket_quantity)', 'sum')
        .where('booking.concert = :concert AND booking.id != :bookingId', { 
          concert: booking.concert.id,
          bookingId: id 
        })
        .getRawOne();

      const currentBooked = Number(sum) || 0;
      const totalAfterUpdate = currentBooked + updateBookingDto.ticket_quantity;

      if (totalAfterUpdate > concert.limit) {
        throw new NotFoundException(
          `Cannot update booking: would exceed concert capacity`,
        );
      }
    }

    // Prepare the update data with proper relation format
    const updateData = {
      ticket_quantity: updateBookingDto.ticket_quantity,
      unit_price: updateBookingDto.unit_price,
    };

    // If concert ID is provided, add it with proper format
    if (updateBookingDto.concert) {
      Object.assign(updateData, {
        concert: { id: updateBookingDto.concert }
      });
    }

    await this.bookingRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id }
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    await this.bookingRepository.remove(booking);
    return { message: `Booking with ID ${id} has been deleted` };
  }
}
