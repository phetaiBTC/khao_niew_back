import { Module } from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { CheckInController } from './check_in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckIn } from './entities/check_in.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
import { BookingDetailsModule } from '../booking-details/booking-details.module';
import { DetailsScan } from 'src/modules/details_scan/entities/details_scan.entity';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import { TransactionManagerService } from 'src/common/transaction/transaction.service';
import { TransactionModule } from 'src/common/transaction/transaction.module';
@Module({
  imports: [TypeOrmModule.forFeature([CheckIn, BookingDetail, DetailsScan ] ),
  BookingDetailsModule,
  TransactionModule,
],
  controllers: [CheckInController],
  providers: [CheckInService ,
    {
        provide: TRANSACTION_MANAGER_SERVICE,
        useClass: TransactionManagerService,
    },
  ],
  exports:[CheckInService]
})

export class CheckInModule {}
