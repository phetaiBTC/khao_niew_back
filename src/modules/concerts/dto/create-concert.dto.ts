import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { EnumConcertStatus } from '../entities/concert.entity';

export class CreateConcertDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  price: number;

  @IsNumber()
  limit: number;

  @IsString()
  date: string; // format: YYYY-MM-DD

  @IsOptional()
  @IsEnum(EnumConcertStatus)
  status?: EnumConcertStatus;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  entertainmentIds?: number[];

  @IsNumber()
  venueId: number;
}
