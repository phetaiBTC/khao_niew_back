import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { CreateCheckInDto } from './dto/create-check_in.dto';
import { UpdateCheckInDto } from './dto/update-check_in.dto';
import 
@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post('/create-check-in')
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkInService.create(createCheckInDto);
  }

  @Get()
  findAll() {
    return this.checkInService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkInService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInService.update(+id, updateCheckInDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkInService.remove(+id);
  }
}
