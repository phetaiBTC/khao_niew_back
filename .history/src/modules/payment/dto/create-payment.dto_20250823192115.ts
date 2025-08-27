import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import {PaymentStatus} from '../entities/payment.entity';
export class CreatePaymentDto {
  @IsNumber()
  amount: number;

@IsDateString()
booking_date: string;
   @IsOptional()
    @IsEnum(PaymentStatus)
    status?: PaymentStatus;
}