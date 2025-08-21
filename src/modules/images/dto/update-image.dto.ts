
// src/modules/images/dto/update-image.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateImageDto } from './create-image.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {}
