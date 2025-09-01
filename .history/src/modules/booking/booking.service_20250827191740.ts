import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
@Injectable()
export class BookingService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManagerService: ITransactionManager,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
    try {
      // 1. Check if the concert exists
      const concert = await this.concertRepository.findOne({
        where: { id: createBookingDto.concert },
      });

      if (!concert) {
        throw new NotFoundException(
          `Concert with id ${createBookingDto.concert} does not exist`,
        );
      }

      // 2. Sum up all ticket_quantity already booked for this concert
      const { sum } = await this.bookingRepository
        .createQueryBuilder('booking')
        .select('SUM(booking.ticket_quantity)', 'sum')
        .where('booking.concert = :concert', {
          concert: createBookingDto.concert,
        })
        .getRawOne();

      const currentBooked = Number(sum) || 0;

      // 3. Check if adding this booking would exceed the limit
      const totalAfterBooking =
        currentBooked + createBookingDto.ticket_quantity;

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
            amount: createBookingDto.payment.amount,
          });
          const savedPayment = await manager.save(Payment, payment);

          // Calculate total amount
          const totalAmount =
            createBookingDto.unit_price * createBookingDto.ticket_quantity;

          // Create booking with proper types
          const booking = manager.create(Booking, {
            ticket_quantity: Number(createBookingDto.ticket_quantity),
            unit_price: Number(createBookingDto.unit_price),
            total_amount: Number(totalAmount),
            user: { id: Number(userId) },
            concert: { id: Number(createBookingDto.concert) },
            payment: savedPayment,
          });

          const savedBooking = await manager.save(Booking, booking);
          console.log('Booking created:', booking);
          // After saving booking...
          const details: BookingDetail[] = [];
          for (let i = 0; i < booking.ticket_quantity; i++) {
            // Generate unique ticket code
            const ticketCode = `${savedBooking.id}-${i + 1}-${Date.now()}`;
            // Generate QR code with relevant booking information
            const qrCodeData = {
              bookingId: savedBooking.id,
              ticketCode: ticketCode,
              concertId: savedBooking.concert.id,
              ticketNumber: i + 1,
              totalTickets: booking.ticket_quantity,

              concertDate: concert.date,
              userId: savedBooking.user.id,
              bookingDate: savedBooking.booking_date,
              // Add a hash for security
              hash: require('crypto')
                .createHash('sha256')
                .update(`${ticketCode}-${savedBooking.id}-${concert.id}`)
                .digest('hex'),
            };

            const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));

            const detail = manager.create(BookingDetail, {
              booking: savedBooking,
              ticket_code: ticketCode,
              qr_code: qrCode,
            });
            details.push(detail);
          }
          const savedDetails = await manager.save(BookingDetail, details);
          return {
            booking: savedBooking,
            details: savedDetails,
          };
        },
      );

      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async findAll(query: PaginateDto) {
    const { status } = query;
    
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('user.companies', 'companies')
      .leftJoinAndSelect('booking.concert', 'concert')
      .leftJoinAndSelect('booking.payment', 'payment')
      .leftJoinAndSelect('booking.details', 'details');

    // Add payment status filter if provided
    if (status) {
      queryBuilder.andWhere('payment.status = :status', { status });
    }

    // Add ordering
    queryBuilder.orderBy('booking.booking_date', 'DESC');

    return queryBuilder.getMany();
  }paginateUtil

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'concert', 'payment', 'details','user.companies'],
      
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['concert'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // If updating ticket quantity, check concert capacity
    if (updateBookingDto.ticket_quantity) {
      const concert = await this.concertRepository.findOne({
        where: { id: booking.concert.id },
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
          bookingId: id,
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
        concert: { id: updateBookingDto.concert },
      });
    }

    await this.bookingRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    await this.bookingRepository.remove(booking);
    return { message: `Booking with ID ${id} has been deleted` };
  }

}
