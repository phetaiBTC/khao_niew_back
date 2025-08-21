import { IsString, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEntertainmentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  imageIds?: number[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  concertIds?: number[];
}
