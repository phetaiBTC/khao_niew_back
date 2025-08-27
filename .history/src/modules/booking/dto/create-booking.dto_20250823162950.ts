import { IsString, IsNumber,IsFloat } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;

  @IsFloat()
  unit_price: number;

  @IsFloat()
  total_amount: number;

  @IsDate()
  booking_date: Date;

  @IsNumber()
  userId: number;

  @IsNumber()
  concertId: number;
}
}