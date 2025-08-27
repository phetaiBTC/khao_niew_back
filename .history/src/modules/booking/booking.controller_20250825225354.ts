import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AuthProfile } from 'src/common/decorator/user.decorator';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create')
  create(@Body() createBookingDto: CreateBookingDto, @AuthProfile('id') userId: string) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get( '/all-bookings')
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('/get-booking/:id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }  

  @Patch('update-booking/:id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete('delete:id')
  delete(@Param('id') id: string) {
    return this.bookingService.delete(+id);
  }
}
