import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AuthProfile } from 'src/common/decorator/user.decorator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/create')
  create(@Body() createBookingDto: CreateBookingDto, @AuthProfile('id') userId: string) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get( '/all-bookings')
  findAll(@Query() query:PaginateDto) {
    return this.bookingService.findAll(query);
  }

  @Get('/get-booking/:id')
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Find one booking by ID
   * @param id booking ID
   * @returns booking found
   */
/*******  ecfa7206-19f0-4170-8fed-cc40422ef037  *******/
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }  

  @Patch('update-booking/:id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete('delete-booking/:id')
  delete(@Param('id') id: string) {
    return this.bookingService.delete(+id);
  }


}
