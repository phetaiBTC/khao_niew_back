import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class DeletePaymentDto {

    @IsNumber()
    id: number;
}
