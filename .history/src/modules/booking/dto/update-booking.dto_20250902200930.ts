import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {

    paymentStatus?: string; // e.g. 'pending', 'success'
  detailsStatus?: string;
}
