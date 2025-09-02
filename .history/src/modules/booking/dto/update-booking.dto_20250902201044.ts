import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
 @IsOptional()
    @IsEnum(PaymentStatus)
    readonly role?: EnumRole;

     @IsOptional()
        @IsEnum(EnumRole)
        readonly role?: EnumRole;
    paymentStatus?: string; // e.g. 'pending', 'success'
  detailsStatus?: string;
}
