import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsNumber,
} from 'class-validator';

export class CompaniesProfilereportDto {

  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'end_date ต้องอยู่ในรูปแบบ YYYY-MM-DD',
  })
  end_date: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'start_date ต้องอยู่ในรูปแบบ YYYY-MM-DD',
  })
  start_date?: string;
}
