import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { PaymentStatus } from 'src/modules/payment/entities/payment.entity';

export class BookingPaginateDto extends PartialType(PaginateDto) {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  companyId?: number;

  @IsOptional()
  @IsString()
  email?: string;
}
