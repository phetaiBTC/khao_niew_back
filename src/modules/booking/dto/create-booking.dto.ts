import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;
  @IsNumber()
  concert: number;

  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsNotEmpty()
  imageIds?: number[];
}
