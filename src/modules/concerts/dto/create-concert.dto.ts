import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
  ValidateIf,
  ArrayNotEmpty,
} from 'class-validator';
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

  // 🔹 ใช้ได้ทั้งแบบเดี่ยวหรือแบบช่วง
  @IsOptional()
  @IsString()
  date?: string; // ใช้กรณีสร้างวันเดียว

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  excludeDays?: (string | number)[]; // ["Saturday", "Sunday"] หรือ [0,6]

  @IsOptional()
  @IsEnum(EnumConcertStatus)
  status?: EnumConcertStatus;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  entertainmentIds?: number[];

  @IsNumber()
  venueId: number;
}
