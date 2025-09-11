import { Module } from '@nestjs/common';
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RolesGuard } from './guards/role.guard';
import { SeederModule } from './database/seeds/seeder.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TransactionModule } from './common/transaction/transaction.module';
import { BookingDetailsModule } from './modules/booking-details/booking-details.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TransactionModule,
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
    AuthModule,
    SeederModule,
    PaymentModule,
    BookingDetailsModule,
    ReportsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
  ],

})
export class AppModule { }
