import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { EntertainmentsService } from './entertainments.service';
import { CreateEntertainmentDto } from './dto/create-entertainment.dto';
import { UpdateEntertainmentDto } from './dto/update-entertainment.dto';

@Controller('entertainments')
export class EntertainmentsController {
  constructor(private readonly entService: EntertainmentsService) {}

  @Post()
  create(@Body() dto: CreateEntertainmentDto) {
    return this.entService.create(dto);
  }

  @Get()
  findAll() {
    return this.entService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
