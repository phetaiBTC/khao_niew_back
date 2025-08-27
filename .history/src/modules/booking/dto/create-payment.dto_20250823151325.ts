import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import {PaymentStatus}
export class CreatePaymentDto {
  @IsNumber()
  id: number;

  @IsString()
  booking: string;

  @IsNumber()
  amount: number;

  @IsString()
  payment_date: string;

  @IsEnum(['pending', 'paid', 'failed']) // assuming these are the possible status values
  status: string;
}