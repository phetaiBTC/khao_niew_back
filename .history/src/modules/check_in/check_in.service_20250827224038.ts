import { Inject, Injectable } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check_in.dto';
import { UpdateCheckInDto } from './dto/update-check_in.dto';
import { InjectRepository ,InjectDataSource} from '@nestjs/typeorm';
import { CheckIn } from './entities/check_in.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
import { DetailsScan } from '../details_scan/entities/details_scan.entity';
import { Repository, DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
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
          // Find booking detail with check-in relation
          const bookingDetail = await manager.findOne(BookingDetail, {
            where: { id: createCheckInDto.booking_details },
            relations: ['check_in', 'booking', 'booking.concert'],
          });

          if (!bookingDetail) {
            throw new Error(`BookingDetail with id ${createCheckInDto.booking_details} not found`);
          }

          if (bookingDetail.check_in) {
            throw new Error(`BookingDetail with id ${createCheckInDto.booking_details} has already been checked in`);
          }

          // Create check-in record
          const checkIn = manager.create(CheckIn, {
            booking_details: bookingDetail,
          });
          const savedCheckIn = await manager.save(CheckIn, checkIn);

          // Update booking detail status
          bookingDetail.status = true;
          await manager.save(BookingDetail, bookingDetail);
          
          // Get the company ID
          const companyId = bookingDetail.booking.user.companies.id;

          // Get the last detail scan for this company to get the current amount
          const lastDetailScan = await manager.findOne(DetailsScan, {
            where: { company_id: companyId },
            order: { created_at: 'DESC' }
          });

          // Calculate new amount (previous amount + 1, or 1 if first entry)
          const newAmount = lastDetailScan ? lastDetailScan.amount + 1 : 1;

          // Create details scan record with incremented amount
          const detailsScan = manager.create(DetailsScan, {
            amount: newAmount,
            company_id: companyId,
            check_in_id: savedCheckIn.id,
            notes: `Scan count: ${newAmount}`
          });
          const savedDetailsScan = await manager.save(DetailsScan, detailsScan);

          return {
            message: 'Check-in completed successfully',
            checkIn: savedCheckIn,
            bookingDetail: bookingDetail,
            detailsScan: savedDetailsScan
          };
        } catch (error) {
          console.error('Error in check-in transaction:', error);
          throw error; // Transaction will automatically rollback
        }
      }
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
