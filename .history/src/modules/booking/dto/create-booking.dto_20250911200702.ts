import { IsNumber, IsDateString, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDto } from 'src/modules/payment/dto/create-payment.dto';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;
  @IsNumber()
  concert: number;
  @IsString()
  images: string;
}
