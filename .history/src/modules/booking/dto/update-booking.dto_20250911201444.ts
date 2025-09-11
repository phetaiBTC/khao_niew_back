import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from 'src/modules/payment/entities/payment.entity';
import { DetailsStatus } from 'src/modules/booking-details/entities/bookingDetails.entity';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsNumber()
  readonly detailsId: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  readonly paymentStatus?: PaymentStatus;
   
  @IsOptional()
  @IsString()
    image: string;

  @IsOptional()
  @IsEnum(DetailsStatus)
  readonly detailsStatus?: DetailsStatus;
}
