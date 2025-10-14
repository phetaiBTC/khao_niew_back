import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;
  @IsNumber()
  concert: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsArray()
  @IsNotEmpty()
  imageIds?: number[];

  @IsNumber()
  @IsOptional()
  userId: number;
}
