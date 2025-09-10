import {

  IsNumber,
 
} from 'class-validator';


export class DeletePaymentDto {
    @IsNumber()
    id: number;
}
