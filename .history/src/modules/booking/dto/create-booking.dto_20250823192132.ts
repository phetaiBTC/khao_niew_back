import { IsString, IsNumber,IsDate ,IsDateString} from 'class-validator';
import { CreatePaymentDto } from 'src/modules/payment/dto/create-payment.dto';
export class CreateBookingDto extends CreatePaymentDto {
  @IsNumber()
  ticket_quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_amount: number;

  @IsDateString()
booking_date: string;

  @IsNumber()
  user: number;
  
  @IsNumber()
  concert: number;

 
}
