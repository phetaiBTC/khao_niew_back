import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentDto {
  
    @IsNumber()
    id: number;
    @IsOptional()
    @IsEnum(PaymentStatus)    
    status: PaymentStatus;
}
