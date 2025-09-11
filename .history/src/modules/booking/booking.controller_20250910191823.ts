import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AuthProfile } from 'src/common/decorator/user.decorator';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { BookingPaginateDto } from './dto/booking-paginate.dto';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create')
  create(@Body() createBookingDto: CreateBookingDto, @AuthProfile('id') userId: string) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get( '/all-bookings')
  findAll(@Query() query:BookingPaginateDto .) {
    return this.bookingService.findAll(query);
  }

  @Get('/get-one/:id')
  findOne(@Param('id') id: number) {
    return this.bookingService.findOne(+id);
  }  

@Patch('update-booking/:id')
async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
  try {
    return await this.bookingService.update(+id, updateBookingDto);
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}
  @Delete('delete-booking/:id')
  delete(@Param('id') id: number) {
    return this.bookingService.delete(id);
  }


}
