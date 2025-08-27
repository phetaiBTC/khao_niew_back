import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import {PaymentStatus} from '../entities/payment.entity';
export class CreatePaymentDto {
  @IsNumber()
  id: number;

  @IsString()
  booking: string;

  @IsNumber()
  amount: number;

  @IsString()
  payment_date: string;

   @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;
}