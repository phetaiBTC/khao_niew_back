import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Booking } from '../booking/entities/booking.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking, BookingDetail])],
  providers: [PaymentService, 
    
  ],
  controllers: [PaymentController]
})
export class PaymentModule {}
