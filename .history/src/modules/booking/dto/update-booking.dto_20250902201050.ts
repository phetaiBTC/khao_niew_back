import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from 'src/modules/payment/entities/payment.entity';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
 @IsOptional()
    @IsEnum(PaymentStatus)
    readonly role?: PaymentStatus;

     @IsOptional()
        @IsEnum(EnumRole)
        readonly role?: EnumRole;
    paymentStatus?: string; // e.g. 'pending', 'success'
  detailsStatus?: string;
}
