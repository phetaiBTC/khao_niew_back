import { Injectable } from '@nestjs/common';
import { CreateDetailsScanDto } from './dto/create-details_scan.dto';
import { UpdateDetailsScanDto } from './dto/update-details_scan.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class DetailsScanService {
  create(createDetailsScanDto: CreateDetailsScanDto) {
    return 'This action adds a new detailsScan';
  }

  findAll( query:PaginateDto) {
 
  }

  findOne(id: number) {
    return `This action returns a #${id} detailsScan`;
  }

  update(id: number, updateDetailsScanDto: UpdateDetailsScanDto) {
    return `This action updates a #${id} detailsScan`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailsScan`;
  }
}
