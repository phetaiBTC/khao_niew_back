import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { Concert } from './entities/concert.entity';
import { Pagination } from 'src/common/interface/pagination.interface';
import { Roles } from 'src/common/decorator/role.decorator';
import { EnumRole } from '../users/entities/user.entity';
@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertService: ConcertsService) { }

  @Post()
  create(@Body() dto: CreateConcertDto) {
    return this.concertService.create(dto);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get()
  findAll(@Query() query: PaginateDto) {
    return this.concertService.findAll(query);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concertService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConcertDto) {
    return this.concertService.update(+id, dto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.concertService.remove(+id);
  // }
}
