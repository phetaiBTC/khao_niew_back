import { Controller, Get, Param } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
@Controller('booking-details')
export class BookingDetailsController {

    constructor(
          private readonly bookingService: BookingDetailsService
    ) {    
    }

     @Get('validate-ticket/:ticketCode')
      async validateTicket(@Param('ticketCode') ticketCode: string) {
        return this.bookingService.validateQrCode(ticketCode);
      }
}
