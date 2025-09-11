import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from '../booking/entities/booking.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
import { TransactionModule } from 'src/common/transaction/transaction.module';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key';


@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking, BookingDetail,TransactionModule])],
  providers: [PaymentService, 
     ,
            {
                provide: TRANSACTION_MANAGER_SERVICE,
                useClass: TransactionManagerService,
            },
  ],
  controllers: [PaymentController]
})
export class PaymentModule {}
