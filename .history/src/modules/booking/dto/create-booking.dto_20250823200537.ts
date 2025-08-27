import { IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDto } from 'src/modules/payment/dto/create-payment.dto';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_amount: number;

  @IsDateString()
  booking_date: string; // ISO string from JSON

  @IsNumber()
  user: number;
  
  @IsNumber()
  concert: number;

  @ValidateNested()
  @Type(() => CreatePaymentDto)
  payment: CreatePaymentDto;
}
