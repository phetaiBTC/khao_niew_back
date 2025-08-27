import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthProfile } from 'src/common/decorator/user.decorator';

@Controller('booking')
@UseGuards(AuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create')
  create(@Body() createBookingDto: CreateBookingDto, @AuthProfile('id') userId: string) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bookingService.delete(+id);
  }
}
