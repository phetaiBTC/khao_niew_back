import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check_in.dto';
import { UpdateCheckInDto } from './dto/update-check_in.dto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { CheckIn } from './entities/check_in.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
import { DetailsScan } from '../details_scan/entities/details_scan.entity';
import { Repository, DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import type { ITransactionManager } from 'src/common/transaction/transaction.interface';
import { PaymentStatus } from '../payment/entities/payment.entity';
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
            relations: [
              'check_in',
              'booking',
              'booking.concert',
              'booking.user',
              'booking.user.companies',
            ],
          });

          if (!bookingDetail) {
            throw new NotFoundException(
              `BookingDetail with id ${createCheckInDto.booking_details} not found`,
            );
          }
          console.log('Found BookingDetail:', bookingDetail.status);
          if (bookingDetail.status == false) {
            throw new NotFoundException(
              `You have already been checked in`,
            );
          }
          if (bookingDetail.check_in) {bookingDetail
            throw new NotFoundException(
              `BookingDetail with id ${createCheckInDto.booking_details} has already been checked in`,
            );
          }
          if (bookingDetail.booking.payment.status !== PaymentStatus.SUCCESS) {
            throw new NotFoundException(
             ,
            );
          }
          // Create check-in record
          const checkIn = manager.create(CheckIn, {
            booking_details: bookingDetail,
          });
          const savedCheckIn = await manager.save(CheckIn, checkIn);

          // Update booking detail status
          bookingDetail.status = true;
          const savedBookingDetail = await manager.save(BookingDetail, bookingDetail);
          console.log('Saved BookingDetail:', savedBookingDetail);
          // Get the company ID
          const companyId = bookingDetail.booking.user.companies.id;

          // Find existing detail scan for this company
          let detailsScan = await manager.findOne(DetailsScan, {
            where: { company: { id: companyId } },
            relations: ['company'],
          });

          if (detailsScan) {
            // Update amount
            detailsScan.amount += 1;

            // Append new check-in ID to array
            detailsScan.checkInIds = [
              ...(detailsScan.checkInIds || []),
              savedCheckIn.id,
            ];

            savedCheckIn.detailsScan = detailsScan;
            await manager.save(CheckIn, savedCheckIn);
            await manager.save(DetailsScan, detailsScan);
          } else {
            // Create new details scan
            detailsScan = manager.create(DetailsScan, {
              amount: 1,
              company: { id: companyId },
              checkInIds: [savedCheckIn.id], // init with new check-in ID
            });
            detailsScan = await manager.save(DetailsScan, detailsScan);

            savedCheckIn.detailsScan = detailsScan;
            await manager.save(CheckIn, savedCheckIn);
          }
          const savedDetailsScan = detailsScan;

          return {
            message: 'Check-in completed successfully',
            checkIn: savedCheckIn,
            bookingDetail: bookingDetail,
            detailsScan: savedDetailsScan,
          };
        } catch (error) {
          console.error('Error in check-in transaction:', error);
          throw error; // Transaction will automatically rollback
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
