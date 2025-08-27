import { IsString, IsNumber,IsDate } from 'class-validator';
import 
export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_amount: number;

  @IsDate()
  booking_date: Date;

  @IsNumber()
  userId: number;
  
  @IsNumber()
  concertId: number;
}
