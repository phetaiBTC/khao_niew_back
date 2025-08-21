// src/modules/venue/dto/create-venue.dto.ts
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsArray()
  @IsOptional()
  imageIds?: number[];
}

