import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DetailsScanService } from './details_scan.service';
import { CreateDetailsScanDto } from './dto/create-details_scan.dto';
import { UpdateDetailsScanDto } from './dto/update-details_scan.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';

@Controller('details-scan')
export class DetailsScanController {
  constructor(private readonly detailsScanService: DetailsScanService) {}

  @Post()
  create(@Body() createDetailsScanDto: CreateDetailsScanDto) {
    return this.detailsScanService.create(createDetailsScanDto);
  }

  @Get()
  findAll(@Query() query: PaginateDto) {
    return this.detailsScanService.findAll( query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailsScanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailsScanDto: UpdateDetailsScanDto) {
    return this.detailsScanService.update(+id, updateDetailsScanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailsScanService.remove(+id);
  }
}
