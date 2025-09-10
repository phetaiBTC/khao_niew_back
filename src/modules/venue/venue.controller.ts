// src/modules/venue/venue.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { paginateUtil } from 'src/common/utils/paginate.util';
import { promises } from 'dns';
import { Pagination } from 'src/common/interface/pagination.interface';
import { Venue } from './entities/venue.entity';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}
  

  @Post()
  create(@Body() dto: CreateVenueDto) {
    return this.venueService.create(dto);
  }

  @Get()
  findAll(@Query() query:PaginateDto) :Promise<Pagination<Venue>> {
    return this.venueService.findAll(query);

  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) : Promise<Venue> {
    return this.venueService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVenueDto) {
    return this.venueService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.venueService.remove(id);
  }
}
