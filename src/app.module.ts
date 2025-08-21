import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { EntertainmentsModule } from './modules/entertainments/entertainments.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from './database/tpye-orm.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ConcertsModule } from './modules/concerts/concerts.module';
import { VenueModule } from './modules/venue/venue.module';
import { ImagesModule } from './modules/images/images.module';
import { CheckInModule } from './modules/check_in/check_in.module';
import { BookingModule } from './modules/booking/booking.module';
import { DetailsScanModule } from './modules/details_scan/details_scan.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmConfig,
    UsersModule,
    EntertainmentsModule,
    CompaniesModule,
    ConcertsModule,
    VenueModule,
    ImagesModule,
    CheckInModule,
    BookingModule,
    DetailsScanModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],

})
export class AppModule { }
