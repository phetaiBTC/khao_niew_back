import { Controller, Get, Param, Query } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { PaginateDto } from 'src/common/dto/paginate.dto';
@Controller('booking-details')
export class BookingDetailsController {

    constructor(
          private readonly bookingService: BookingDetailsService
    ) {}

      @Get('/get-all')
      async getBookingDetails(@Query() query: PaginateDto ,@AuthProfile('id') userId: string) {
        try {
          return await this.bookingService.getBookingDetails(query, userId);
        } catch (error) {
          console.error('Error in getBookingDetails:', error);
          throw error;
        }
      }
}
