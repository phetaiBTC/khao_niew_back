import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  ticket_quantity: number;
  @IsNumber()
  concert: number;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly username: string;

  @IsArray()
  @IsNotEmpty()
  imageIds?: number[];

  @IsNumber()
  @IsOptional()
  userId: number;
}
