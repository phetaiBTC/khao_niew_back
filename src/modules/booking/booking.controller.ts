import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AuthProfile } from 'src/common/decorator/user.decorator';
import { BookingPaginateDto } from './dto/booking-paginate.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { EnumRole } from '../users/entities/user.entity';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Post('/create')
  create(
    @Body() createBookingDto: CreateBookingDto,
   
  ) {
    return this.bookingService.create(createBookingDto, +createBookingDto.userId);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get('/all-bookings')
  findAll(
    @Query() query: BookingPaginateDto,
    @AuthProfile('id') userId: number,
  ) {
    return this.bookingService.findAll(query, userId);
  }

  @Get('/get-one/:id')
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  findOne(@Param('id') id: number) {
    return this.bookingService.findOne(+id);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Patch('update-booking/:id')
  async update(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    try {
      return await this.bookingService.update(+id, updateBookingDto);
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Delete('delete-booking/:id')
  delete(@Param('id') id: number) {
    return this.bookingService.delete(id);
  }
}
