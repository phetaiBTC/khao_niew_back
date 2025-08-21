import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailsScanDto } from './create-details_scan.dto';

export class UpdateDetailsScanDto extends PartialType(CreateDetailsScanDto) {}
