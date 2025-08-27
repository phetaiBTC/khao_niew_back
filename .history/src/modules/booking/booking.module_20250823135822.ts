import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [Ty],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
