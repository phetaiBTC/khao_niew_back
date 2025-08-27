import { Module } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './booking-details.controller';
import { Booking } from '../booking/entities/booking.entity';
@Module({
    imports: [T],
    controllers: [BookingDetailsController       
    ],
    providers: [BookingDetailsService],
    exports: [BookingDetailsService],
})
export class BookingDetailsModule {

}
