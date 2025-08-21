import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntertainmentsService } from './entertainments.service';
import { CreateEntertainmentDto } from './dto/create-entertainment.dto';
import { UpdateEntertainmentDto } from './dto/update-entertainment.dto';

@Controller('entertainments')
export class EntertainmentsController {
  constructor(private readonly entertainmentsService: EntertainmentsService) {}

  @Post()
  create(@Body() createEntertainmentDto: CreateEntertainmentDto) {
    return this.entertainmentsService.create(createEntertainmentDto);
  }

  @Get()
  findAll() {
    return this.entertainmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entertainmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntertainmentDto: UpdateEntertainmentDto) {
    return this.entertainmentsService.update(+id, updateEntertainmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entertainmentsService.remove(+id);
  }
}
