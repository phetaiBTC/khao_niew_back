import { Controller, Get } from '@nestjs/common';

@Controller('booking-details')
export class BookingDetailsController {

    constructor() {}

     @Get('validate-ticket/:ticketCode')
      async validateTicket(@Param('ticketCode') ticketCode: string) {
        return this.bookingService.validateQrCode(ticketCode);
      }
}
