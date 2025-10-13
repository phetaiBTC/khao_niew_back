import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;
  @IsNumber()
  concert: number;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsArray()
  @IsNotEmpty()
  imageIds?: number[];
}
