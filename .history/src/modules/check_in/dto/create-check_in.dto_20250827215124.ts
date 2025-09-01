import { IsNumber, IsDateString, ValidateNested } from 'class-validator';

export class CreateCheckInDto {
    @IsNumber()
    booking_details: number;
    
    @IsDateString()
    check_in_time: string;
}
