import { Module } from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { CheckInController } from './check_in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckIn } from './entities/check_in.entity';
import { BookingDetail } from '../booking-details/entities/bookingDetails.entity';
@Module({
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
