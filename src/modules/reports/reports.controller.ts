import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthProfile } from 'src/common/decorator/user.decorator';
import { PayloadDto } from '../auth/dto/auth.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('users-by-role')
  getUsersByRole() {
    return this.reportsService.getUsersByRole();
  }

  @Get('companies')
  getCompaniesCount() {
    return this.reportsService.getCompaniesCount();
  }

  @Get('revenue')
  getTotalRevenue() {
    return this.reportsService.getTotalRevenue();
  }

  @Get('bookings-by-concert')
  getBookingsByConcert() {
    return this.reportsService.getBookingsByConcert();
  }

  @Get('bookings-by-venue')
  getBookingsByVenue() {
    return this.reportsService.getBookingsByVenue();
  }

  @Get('checkins')
  getCheckInCount() {
    return this.reportsService.getCheckInCount();
  }

  @Get('sales-daily')
  getSalesDaily(@Query('year') year: number, @Query('month') month: number) {
    return this.reportsService.getSalesDaily(
      year || new Date().getFullYear(),
      month || new Date().getMonth() + 1,
    );
  }

  @Get('sales-monthly')
  getSalesMonthly(@Query('year') year: number) {
    return this.reportsService.getSalesMonthly(
      year || new Date().getFullYear(),
    );
  }

  @Get('bookings-by-company')
  getBookingsByCompany() {
    return this.reportsService.getBookingsByCompany();
  }

  @Get('all-reports')
  getAllReports(@Query('year') year: number, @Query('month') month: number) {
    return this.reportsService.getDashboardReport(
      year || new Date().getFullYear(),
      month || new Date().getMonth() + 1,
    );
  }

  @Get('report-revenue')
  getMonthlyConcertReport(@Query('year') year: number) {
    return this.reportsService.getMonthlyConcertReport(
      year || new Date().getFullYear(),
    );
  }

  @Get('excel')
  async exportReport(@Res() res, @Query('year') year: number) {
    const buffer = await this.reportsService.generateToExcel(Number(year));

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="report_${year}.xlsx"`,
      'Content-Length': buffer.byteLength,
    });

    res.end(buffer);
  }

  @Get('booking-report-company')
  getbookingReport(
    @AuthProfile() user: PayloadDto,
    @Query('start') start: string, // e.g. 2025-05-03
    @Query('end') end: string, // e.g. 2025-06-01
  ) {
    return this.reportsService.getbookingReportByDate(user, start, end);
  }
}
