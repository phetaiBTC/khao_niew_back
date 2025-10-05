import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { CreateCheckInDto } from './dto/create-check_in.dto';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post('/create-check-in')
  create(@Body() createCheckInDto: CreateCheckInDto) {
    return this.checkInService.create(createCheckInDto);
  }

}
