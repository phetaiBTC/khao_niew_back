import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCheckInDto {
    @IsNumber()
    @IsNotEmpty()
    booking_details: number;

    @IsNumber()
    @IsNotEmpty()
    company_id: number;

    @IsNumber()
    amount?: number; // Optional - will use concert price if not provided
}
