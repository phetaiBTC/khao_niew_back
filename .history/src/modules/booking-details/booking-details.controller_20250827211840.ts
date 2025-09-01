import { Controller, Get, Param } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { PaginateDto } from 'src/common/dto/paginate.dto';
@Controller('booking-details')
export class BookingDetailsController {

    constructor(
          private readonly bookingService: BookingDetailsService
    ) {}

      @Get('/get-all')
      async getBookingDetails(@Query() query: PaginateDto) {
        try {
          return await this.bookingService.getBookingDetails(query);
        } catch (error) {
          console.error('Error in getBookingDetails:', error);
          throw error;
        }
      }
}
