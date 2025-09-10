import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;
}
