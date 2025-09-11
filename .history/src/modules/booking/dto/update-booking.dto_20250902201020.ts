import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsOptional } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
 @IsOptional()
    @IsEnum(EnumRole)
    readonly role?: EnumRole;

     @IsOptional()
        @IsEnum(EnumRole)
        readonly role?: EnumRole;
    paymentStatus?: string; // e.g. 'pending', 'success'
  detailsStatus?: string;
}
