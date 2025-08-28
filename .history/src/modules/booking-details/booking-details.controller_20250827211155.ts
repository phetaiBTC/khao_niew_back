import { Controller, Get, Param } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { Pagination } from 'src/common/interface/pagination.interface';
@Controller('booking-details')
export class BookingDetailsController {

    constructor(
          private readonly bookingService: BookingDetailsService
    ) {}

      @Get('/get-booking-details-by-booking-id/:id')
      getBookingDetails(query : Pagination) {
        return this.bookingService.findBookingDetailsByBookingId(+id);
      }
}
