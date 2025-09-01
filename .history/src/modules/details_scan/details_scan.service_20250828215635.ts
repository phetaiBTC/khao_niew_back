import { Injectable } from '@nestjs/common';
import { CreateDetailsScanDto } from './dto/create-details_scan.dto';
import { UpdateDetailsScanDto } from './dto/update-details_scan.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import {DetailsScan} from './entities/details_scan.entity'
import { paginateUtil } from 'src/common/utils/paginate.util';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class DetailsScanService {
  constructor(
  @InjectRepository(DetailsScan)
  private readonly detailsScanRepository: Repository<DetailsScan>
) {}
  create(createDetailsScanDto: CreateDetailsScanDto) {
    return 'This action adds a new detailsScan';
  }

findAll(query: PaginateDto) {
  const qb = this.detailsScanRepository.createQueryBuilder('detailsScan');
  if (query.search) {
    qb.where('detailsScan.name LIKE :search', {
      search: `%${query.search}%`,
    });
  }
  return paginateUtil(qb, query);
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
