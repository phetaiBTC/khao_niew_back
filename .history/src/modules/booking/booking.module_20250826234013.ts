import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';
import { TransactionManagerService } from 'src/common/transaction/transaction.service';
import { TransactionModule } from 'src/common/transaction/transaction.module';
import { Concert } from '../concerts/entities/concert.entity';
import { User } from '../users/entities/user.entity';
import { BookingDetail } from './entities/bookingDetails.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Booking , Payment, Concert,User]),
TransactionModule,],
  controllers: [BookingController],
  providers: [BookingService ,
        {
            provide: TRANSACTION_MANAGER_SERVICE,
            useClass: TransactionManagerService,
        },
  ],
  exports:[BookingService]
})
export class BookingModule {}
