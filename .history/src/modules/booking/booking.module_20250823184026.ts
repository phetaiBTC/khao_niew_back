import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [BookingController],
  providers: [BookingService ,
   
        {
            provide: 'StudentRepository',
            useClass: StudentRepositoryOrm
        },
        {
            provide: TRANSACTION_MANAGER_SERVICE,
            useClass: TransactionManagerService,
        },
  ],
  exports:[BookingService]
})
export class BookingModule {}
