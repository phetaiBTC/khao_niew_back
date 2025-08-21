import { PartialType } from '@nestjs/mapped-types';
import { CreateCheckInDto } from './create-check_in.dto';

export class UpdateCheckInDto extends PartialType(CreateCheckInDto) {}
