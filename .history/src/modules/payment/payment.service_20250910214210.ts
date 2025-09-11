import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Booking } from '../booking/entities/booking.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingDetail)
    private readonly bookingDetailRepository: Repository<BookingDetail>,
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManagerService: ITransactionManager,
  ) {}

  async updateStatus(body : UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    await this.paymentRepository.update(id, { status });
    return { message: `Payment status updated to ${status}` };
  }

  async delete(id: number) {
    return this.transactionManagerService.runInTransaction(
      this.dataSource,
      async (manager) => {
        // Find payment with related booking
        const payment = await manager.findOne(Payment, {
          where: { id },
          relations: ['booking'],
        });
        if (!payment) {
          throw new NotFoundException(`Payment with ID ${id} not found`);
        }

        // Find bookings linked to this payment
        const bookings = await manager.find(Booking, {
          where: { payment: { id } },
          relations: ['details'],
        });

        // Delete booking details for each booking
        for (const booking of bookings) {
          if (Array.isArray(booking.details) && booking.details.length > 0) {
            await manager.remove(BookingDetail, booking.details);
          }
          await manager.remove(Booking, booking);
        }

        // Finally, delete the payment
        await manager.remove(Payment, payment);

        return { message: `Payment with ID ${id} and all related data has been deleted` };
      }
    );
  }
}
