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
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { paginateUtil } from 'src/common/utils/paginate.util';
import { BookingPaginateDto } from './dto/booking-paginate.dto';
import { User } from '../users/entities/user.entity';
import { EnumRole } from '../users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { fileExists, removeFile } from '../../common/interceptors/upload-image.interceptor';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      console.log('Current booked tickets:', currentBooked);
      // 3. Check if adding this booking would exceed the limit
      const totalAfterBooking =
        currentBooked + createBookingDto.ticket_quantity;

      if (createBookingDto.ticket_quantity > concert.limit) {
        throw new NotFoundException(
          `This Concert has only ${concert.limit} tickets available now it remains ${concert.limit - currentBooked} tickets`,
        );
      }
      if (totalAfterBooking > concert.limit) {
        throw new NotFoundException(
          `This Concert is fully booked (${concert.limit} tickets available)`,
        );
      }

      // Use transaction to ensure both booking and payment are created successfully
      const result = await this.transactionManagerService.runInTransaction(
        this.dataSource,
        async (manager) => {
          // Create payment
          const payment = manager.create(Payment, {
            amount: createBookingDto.ticket_quantity,
            image: createBookingDto.image,
          });
          const savedPayment = await manager.save(Payment, payment);

          // Calculate total amount
          const totalAmount = concert.price * createBookingDto.ticket_quantity;

          // Create booking with proper types
          const booking = manager.create(Booking, {
            ticket_quantity: Number(createBookingDto.ticket_quantity),
            unit_price: Number(concert.price),
            total_amount: Number(totalAmount),

            user: { id: Number(userId) },
            concert: { id: Number(createBookingDto.concert) },
            payment: savedPayment,
          });

          const savedBooking = await manager.save(Booking, booking);

          // After saving booking...
          const details: BookingDetail[] = [];
          for (let i = 0; i < booking.ticket_quantity; i++) {
            // Generate unique ticket code
            const detail = manager.create(BookingDetail, {
              booking: savedBooking,
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

  async findAll(query: BookingPaginateDto, userId?: number) {
    const { status, companyId } = query;
    const checkRole = await this.userRepository.findOneBy({ id: userId });
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
    if (companyId) {
      queryBuilder.andWhere('companies.id = :companyId', { companyId });
    }
    if (checkRole?.role === EnumRole.COMPANY) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    }

    // Use paginateUtil for pagination
    return paginateUtil(queryBuilder, query);
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'concert', 'payment', 'details', 'user.companies'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      // 1. Fetch booking with relations
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['concert', 'payment', 'details'],
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      // 2. Determine concert (current or updated)
      const concertId = updateBookingDto.concert || booking.concert.id;
      const concert = await this.concertRepository.findOne({
        where: { id: concertId },
      });

      if (!concert) {
        throw new NotFoundException(`Concert with ID ${concertId} not found`);
      }

      // 3. Validate ticket quantity
      const newTicketQuantity =
        updateBookingDto.ticket_quantity || booking.ticket_quantity;

      if (updateBookingDto.ticket_quantity) {
        const { sum } = await this.bookingRepository
          .createQueryBuilder('booking')
          .select('SUM(booking.ticket_quantity)', 'sum')
          .where('booking.concert = :concert AND booking.id != :bookingId', {
            concert: concertId,
            bookingId: id,
          })
          .getRawOne();

        const currentBooked = Number(sum) || 0;
        const totalAfterUpdate = currentBooked + newTicketQuantity;

        if (newTicketQuantity > concert.limit) {
          throw new NotFoundException(
            `This Concert has only ${concert.limit} tickets available! now it remains ${concert.limit - currentBooked} tickets available`,
          );
        }

        if (totalAfterUpdate > concert.limit) {
          throw new NotFoundException(
            `Cannot update booking: the concert is fully booked (${concert.limit} tickets available)`,
          );
        }
      }

      // 4. Calculate new total amount
      const totalAmount = concert.price * newTicketQuantity;

      // 5. Transaction: update booking, payment, and booking details
      await this.transactionManagerService.runInTransaction(
        this.dataSource,
        async (manager) => {
          // Update booking
          await manager.update(Booking, id, {
            ticket_quantity: newTicketQuantity,
            total_amount: totalAmount,
            ...(updateBookingDto.concert ? { concert: { id: concertId } } : {}),
          });

          // Update payment if ticket quantity changed
          if (updateBookingDto.ticket_quantity && booking.payment) {
            await manager
              .createQueryBuilder()
              .update(Payment)
              .set({ amount: newTicketQuantity })
              .where('id = :id', { id: booking.payment.id })
              .execute();
          }
          // Update payment image if provided
          if (updateBookingDto.image && booking.payment) {
            // Extract filename from image URL
            const newImageUrl = updateBookingDto.image;
         const newImageFilename = path.basename(updateBookingDto.image || '');
            const oldImageUrl = booking.payment.image;
            const oldImageFilename = path.basename(booking.payment.image || '');
            const imageDir = path.join(__dirname, '../../../uploads/images/');
            const oldImagePath = path.join(imageDir, oldImageUrl);

            // If old and new image are the same, return message
            if (oldImageUrl === newImageUrl) {
              throw new Error('this image already use now');
            }

            // Remove old image if exists using utility
            if (oldImageUrl && await fileExists(oldImagePath)) {
              await removeFile(oldImagePath);
            }

            // Update payment image in DB (save only filename)
            await manager
              .createQueryBuilder()
              .update(Payment)
              .set({ image: newImageUrl })
              .where('id = :id', { id: booking.payment.id })
              .execute();
          }

          // 5a. Fetch current booking details
          const currentDetails = await manager.find(BookingDetail, {
            where: { booking: { id } },
          });
          // Update payment status if provided
          if (updateBookingDto.paymentStatus && booking.payment) {
            await manager
              .createQueryBuilder()
              .update(Payment)
              .set({ status: updateBookingDto.paymentStatus })
              .where('id = :id', { id: booking.payment.id })
              .execute();
          }

          // 5b. Add or remove details to match new ticket quantity
          if (newTicketQuantity > currentDetails.length) {
            // Add missing details
            const newDetails: BookingDetail[] = [];
            for (let i = currentDetails.length; i < newTicketQuantity; i++) {
              const detail = manager.create(BookingDetail, { booking: { id } });
              newDetails.push(detail);
            }
            await manager.save<BookingDetail>(newDetails);
          } else if (newTicketQuantity < currentDetails.length) {
            // Remove extra details
            const toRemove = currentDetails.slice(newTicketQuantity);
            await manager.remove(BookingDetail, toRemove);
          }
        },
      );

      // 6. Return updated booking with refreshed relations
      return this.bookingRepository.findOne({
        where: { id },
        relations: ['concert', 'payment', 'details'],
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async delete(id: number) {
    return this.transactionManagerService.runInTransaction(
      this.dataSource,
      async (manager) => {
        // Find the booking with all its relations
        const booking = await manager.findOne(Booking, {
          where: { id },
          relations: ['details', 'payment'],
        });

        if (!booking) {
          throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        // Remove check_in linked to each detail
        if (booking.details && booking.details.length > 0) {
          for (const detail of booking.details) {
            // Make sure detail is loaded with id
            if (detail.id) {
              const checkIn = await manager.findOne('CheckIn', {
                where: { booking_details: { id: detail.id } },
              });
              if (checkIn) {
                await manager.remove('CheckIn', checkIn);
              }
            }
          }
          // Remove all details in one call
          await manager.remove(BookingDetail, booking.details);
        }

        // Store payment reference
        const payment = booking.payment;

        // Remove the payment reference using QueryBuilder
        await manager
          .createQueryBuilder()
          .update(Booking)
          .set({ payment: null })
          .where('id = :id', { id: booking.id })
          .execute();

        // Now delete the booking
        await manager.remove(Booking, booking);

        // Finally delete the payment if it exists
        if (payment) {
          await manager.remove(Payment, payment);
        }

        return {
          message: `Booking with ID ${id} and all related data has been deleted`,
        };
      },
    );
  }
}
