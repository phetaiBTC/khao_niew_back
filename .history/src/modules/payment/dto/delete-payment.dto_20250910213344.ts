import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';


export class DeletePaymentDto {
    @IsNumber()
    id: number;
}
