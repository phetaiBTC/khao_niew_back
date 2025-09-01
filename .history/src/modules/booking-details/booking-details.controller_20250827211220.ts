import { Controller, Get, Param } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { PaginateDto } from 'src/common/dto/paginate.dto';
@Controller('booking-details')
export class BookingDetailsController {

    constructor(
          private readonly bookingService: BookingDetailsService
    ) {}

      @Get('/get-booking-details-by-booking-id/:id')
      getBookingDetails(query : PaginateDto) {
        return this.bookingService.findBookingDetailsByBookingId(query);
      }
}
