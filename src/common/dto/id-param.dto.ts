import { IsInt } from 'class-validator';

export class IdParamDto {
  @IsInt({ message: 'id must be an integer' })
  id: number;
}
