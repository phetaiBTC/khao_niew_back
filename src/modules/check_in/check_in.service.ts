import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check_in.dto';
import { UpdateCheckInDto } from './dto/update-check_in.dto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { CheckIn } from './entities/check_in.entity';
import {
  BookingDetail,
  DetailsStatus,
} from '../booking-details/entities/bookingDetails.entity';
import { DetailsScan } from '../details_scan/entities/details_scan.entity';
import { Repository, DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
import { PaymentStatus } from '../payment/entities/payment.entity';
import { Booking } from '../booking/entities/booking.entity';
@Injectable()
export class CheckInService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly transactionManager: ITransactionManager,
    @InjectRepository(CheckIn)
    private checkInRepository: Repository<CheckIn>,
    @InjectRepository(BookingDetail)
    private bookingDetailRepository: Repository<BookingDetail>,
    @InjectRepository(DetailsScan)
    private detailsScanRepository: Repository<DetailsScan>,
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
          console.log('Booking Detail:', bookingDetail);
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
          throw error; // rollback อัตโนมัติ
        }
      },
    );
  }

  findAll() {
    return `This action returns all checkIn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkIn`;
  }

  update(id: number, updateCheckInDto: UpdateCheckInDto) {
    return `This action updates a #${id} checkIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkIn`;
  }
}
