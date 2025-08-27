import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_amount: number;

  @IsString()
  booking_date: string; // or @IsDate() if you're using a date library like moment.js
}