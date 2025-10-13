import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Booking } from '../booking/entities/booking.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
        private eventEmitter: EventEmitter2,
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManagerService: ITransactionManager,
  ) {}

  async updateStatus(id: number, body: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({ where: { id } ,relations: ['booking', 'booking.details', 'booking.user', 'booking.concert', 'booking.payment']});
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    await this.paymentRepository.update(id, { status: body.status });

    this.eventEmitter.emit('payment.successful', payment.booking);
    return { message: `Payment status updated to ${body.status}` };
  }

  async delete(id: number) {
    return this.transactionManagerService.runInTransaction(
      this.dataSource,
      async (manager) => {
        const payment = await manager.findOne(Payment, {
          where: { id },
          relations: ['booking'],
        });
        if (!payment) {
          throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        const bookings = await manager.find(Booking, {
          where: { payment: { id } },
          relations: ['details'],
        });
        for (const booking of bookings) {
          if (Array.isArray(booking.details) && booking.details.length > 0) {
            for (const detail of booking.details) {
              const checkIn = await manager.findOne('CheckIn', {
                where: { booking_details: { id: detail.id } },
              });
              if (checkIn) {
                await manager.remove('CheckIn', checkIn);
              }
            }
            await manager.remove(BookingDetail, booking.details);
          }
          await manager.remove(Booking, booking);
        }
        await manager.remove(Payment, payment);
        return {
          message: `Payment with ID ${id} and all related data has been deleted`,
        };
      },
    );
  }
}
