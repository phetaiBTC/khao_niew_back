import { Injectable } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check_in.dto';
import { UpdateCheckInDto } from './dto/update-check_in.dto';

@Injectable()
export class CheckInService {
  create(createCheckInDto: CreateCheckInDto) {
      try {
       

        return `This action adds a new checkIn`;
      } catch (error) {
        console.log(error);
        throw error;
      }

  }

  findAll() {
    return `This action returns all checkIn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkIn`;
  }

  update(id: number, updateCheckInDto: UpdateCheckInDto) {
    return `This action updates a #${id} checkIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkIn`;
  }
}
