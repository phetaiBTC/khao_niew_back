import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { Venue } from '../venue/entities/venue.entity';

// Entities
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      Booking,
      Payment,
      Concert,
      Venue,
    ]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
