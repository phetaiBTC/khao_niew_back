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
    
  ) {}
  async create(createCheckInDto: CreateCheckInDto) {
      try {
         const bookingDetail = await this.bookingDetailRepository.findOne({
          where: { id: createCheckInDto.booking_details },
          relations: ['check_in'],
        });

        if (!bookingDetail) {
          throw new Error(`BookingDetail with id ${createCheckInDto.booking_details} not found`);
        }

        if (bookingDetail.check_in) {
          throw new Error(`BookingDetail with id ${createCheckInDto.booking_details} has already been checked in`);
        }

        const checkIn = this.checkInRepository.create({
          booking_details: bookingDetail,
        });

        await this.checkInRepository.save(checkIn);

        // Update the status in BookingDetail
        bookingDetail.status = true;
        await this.bookingDetailRepository.save(bookingDetail);

        return `This action adds a new checkIn`;
      } catch (error) {
        console.log(error);
        throw error;
      }

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
