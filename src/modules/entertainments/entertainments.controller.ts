import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { EntertainmentsService } from './entertainments.service';
import { CreateEntertainmentDto } from './dto/create-entertainment.dto';
import { UpdateEntertainmentDto } from './dto/update-entertainment.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { Pagination } from 'src/common/interface/pagination.interface';
import { Entertainment } from './entities/entertainment.entity';

@Controller('entertainments')
export class EntertainmentsController {
  constructor(private readonly entService: EntertainmentsService) {}

  @Post()
  create(@Body() dto: CreateEntertainmentDto) {
    return this.entService.create(dto);
  }

  @Get()
  findAll(@Query() query:PaginateDto) :Promise<Pagination<Entertainment>> {
    return this.entService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) : Promise<Entertainment> {
    return this.entService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEntertainmentDto) {
    return this.entService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entService.remove(+id);
  }
}
