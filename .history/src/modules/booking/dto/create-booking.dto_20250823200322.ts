export class CreateBookingDto extends CreatePaymentDto {
  @IsNumber()
  ticket_quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_amount: number;

  @IsDate()
  booking_date: Date;

  @IsNumber()
  user: number;
  
  @IsNumber()
  concert: number;
}