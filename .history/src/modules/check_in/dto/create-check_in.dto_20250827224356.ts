import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCheckInDto {
    @IsNumber()
    @IsNotEmpty()
    booking_details: number;
}
