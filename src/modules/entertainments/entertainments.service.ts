import { Injectable } from '@nestjs/common';
import { CreateEntertainmentDto } from './dto/create-entertainment.dto';
import { UpdateEntertainmentDto } from './dto/update-entertainment.dto';

@Injectable()
export class EntertainmentsService {
  create(createEntertainmentDto: CreateEntertainmentDto) {
    return 'This action adds a new entertainment';
  }

  findAll() {
    return `This action returns all entertainments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} entertainment`;
  }

  update(id: number, updateEntertainmentDto: UpdateEntertainmentDto) {
    return `This action updates a #${id} entertainment`;
  }

  remove(id: number) {
    return `This action removes a #${id} entertainment`;
  }
}
