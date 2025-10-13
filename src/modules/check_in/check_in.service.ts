import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check_in.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  BookingDetail,
  DetailsStatus,
} from '../booking-details/entities/bookingDetails.entity';
import { DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
import { PaymentStatus } from '../payment/entities/payment.entity';

@Injectable()
export class CheckInService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManager: ITransactionManager,
  ) {}
  async create(createCheckInDto: CreateCheckInDto) {
    return this.transactionManager.runInTransaction(
      this.dataSource,
      async (manager) => {
        try {
          const bookingDetail = await manager.findOne(BookingDetail, {
            where: { id: createCheckInDto.booking_details },
            relations: ['booking', 'booking.payment'],
          });
          if (!bookingDetail) {
            throw new NotFoundException('Booking Detail not found');
          }
          if (bookingDetail.booking.payment.status !== PaymentStatus.SUCCESS) {
            throw new BadRequestException(
              'Cannot check-in: Payment not completed',
            );
          }
          await manager.update(BookingDetail, bookingDetail.id, {
            status: DetailsStatus.CHECKED_IN,
          });
          
          return { message: 'Check-in successful' };
        } catch (error) {
          console.error('Error in check-in transaction:', error);
          throw error;
        }
      },
    );
  }

}
