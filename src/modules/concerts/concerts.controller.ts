import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertService: ConcertsService) {}

  @Post()
  create(@Body() dto: CreateConcertDto) {
    return this.concertService.create(dto);
  }

  @Get()
  findAll() {
    return this.concertService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concertService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConcertDto) {
    return this.concertService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concertService.remove(+id);
  }
}
