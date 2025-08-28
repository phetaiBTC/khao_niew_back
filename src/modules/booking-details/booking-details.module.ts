import { Module } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './booking-details.controller';
import { Booking } from '../booking/entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetail } from './entities/bookingDetails.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BookingDetail,Booking  ])],
    controllers: [BookingDetailsController       
    ],
    providers: [BookingDetailsService],
    exports: [BookingDetailsService],
})
export class BookingDetailsModule {}
