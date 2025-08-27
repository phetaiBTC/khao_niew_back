import { Module } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './booking-details.controller';
@Module({
    imports: [],
    controllers: [BookingDetailsController       
    ],
    providers: [BookingDetailsService],
    exports: [Booking],
})
export class BookingDetailsModule {

}
