import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;
  @IsNumber()
  concert: number;

  @IsOptional()
  @IsNumber()
  phone_number: number;

  @IsOptional()
  @IsString()
  email: number;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  imageIds?: number[];
}
