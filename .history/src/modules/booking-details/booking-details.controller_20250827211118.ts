import { Controller, Get, Param } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
@Controller('booking-details')
export class BookingDetailsController {

    constructor(
          private readonly bookingService: BookingDetailsService
    ) {}

      @Get('/get-booking-details-by-booking-id/:id')
      findBookingDetailsByBookingId(@Param('id') id: number) {
        return this.bookingService.findBookingDetailsByBookingId(+id);
      }
}
