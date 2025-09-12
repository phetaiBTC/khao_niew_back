import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { Venue } from '../venue/entities/venue.entity';
import { CheckIn } from '../check_in/entities/check_in.entity';
import * as ExcelJS from 'exceljs';
import { dayjsUtil } from 'src/common/utils/dayjs.util';
import { PayloadDto } from '../auth/dto/auth.dto';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Concert)
    private readonly concertRepo: Repository<Concert>,
    @InjectRepository(Venue) private readonly venueRepo: Repository<Venue>,
    @InjectRepository(CheckIn)
    private readonly checkinRepo: Repository<CheckIn>,
  ) {}

  async getUsersByRole() {
    return this.userRepo
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('user.role')
      .getRawMany();
  }

  async getCompaniesCount() {
    return { total: await this.companyRepo.count() };
  }

  async getTotalRevenue() {
    const result = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'success' })
      .getRawOne();

    return { total_revenue: Number(result.total) || 0 };
  }

  async getBookingsByConcert() {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.concert', 'concert')
      .addSelect('COUNT(booking.id)', 'total_bookings')

      .getRawMany();
  }

  async getBookingsByVenue() {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.concert', 'concert')
      .leftJoin('concert.venue', 'venue')
      .select('venue.name', 'venue')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .groupBy('venue.name')
      .getRawMany();
  }

  async getCheckInCount() {
    return { total_checkins: await this.checkinRepo.count() };
  }

  async getSalesDaily(year: number, month: number) {
    return this.paymentRepo
      .createQueryBuilder('payment')
      .select('DATE(payment.payment_date)', 'date')
      .addSelect('SUM(payment.amount)', 'revenue')
      .where('payment.status = :status', { status: 'success' })
      .andWhere('EXTRACT(YEAR FROM payment.payment_date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM payment.payment_date) = :month', { month })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getSalesMonthly(year: number) {
    return this.paymentRepo
      .createQueryBuilder('payment')
      .select("DATE_FORMAT(payment.payment_date, '%Y-%m')", 'month')
      .addSelect('SUM(payment.amount)', 'revenue')
      .where('payment.status = :status', { status: 'success' })
      .andWhere('YEAR(payment.payment_date) = :year', { year })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getBookingsByCompany() {
    return this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.user', 'user')
      .leftJoin('user.companies', 'companies')
      .select('companies.name', 'companies')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .groupBy('companies.id')
      .orderBy('total_bookings', 'DESC')
      .getRawMany();
  }

  async getDashboardReport(year: number, month: number) {
    // Users by role
    const usersByRole = await this.userRepo
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('user.role')
      .getRawMany();

    // Companies count
    const totalCompanies = await this.companyRepo.count();

    // Total revenue
    const revenueResult = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'success' })
      .getRawOne();
    const totalRevenue = Number(revenueResult.total) || 0;

    // Bookings per concert
    const bookingsByConcert = await this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.concert', 'concert')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .groupBy('concert.id')
      .getRawMany();

    // Bookings per venue
    const bookingsByVenue = await this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.concert', 'concert')
      .leftJoin('concert.venue', 'venue')
      .select('venue.name', 'venue')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .groupBy('venue.id')
      .getRawMany();

    // Total check-ins
    const totalCheckIns = await this.checkinRepo.count();

    // Sales daily
    const salesDaily = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('DATE(payment.payment_date)', 'date')
      .addSelect('SUM(payment.amount)', 'revenue')
      .where('payment.status = :status', { status: 'success' })
      .andWhere('YEAR(payment.payment_date) = :year', { year })
      .andWhere('MONTH(payment.payment_date) = :month', { month })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Sales monthly
    const salesMonthly = await this.paymentRepo
      .createQueryBuilder('payment')
      .select("DATE_FORMAT(payment.payment_date, '%Y-%m')", 'month')
      .addSelect('SUM(payment.amount)', 'revenue')
      .where('payment.status = :status', { status: 'success' })
      .andWhere('YEAR(payment.payment_date) = :year', { year })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Bookings per company
    const bookingsByCompany = await this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.user', 'user')
      .leftJoin('user.companies', 'companies')
      .select('companies.name', 'companies')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .groupBy('companies.id')
      .orderBy('total_bookings', 'DESC')
      .getRawMany();

    return {
      usersByRole,
      totalCompanies,
      totalRevenue,
      bookingsByConcert,
      bookingsByVenue,
      totalCheckIns,
      salesDaily,
      salesMonthly,
      bookingsByCompany,
    };
  }

  async getMonthlyConcertReport(year: number) {
    // ดึงข้อมูลจำนวน booking และ revenue ต่อ concert ต่อเดือน
    const result = await this.bookingRepo
      .createQueryBuilder('booking')
      .select('MONTH(booking.booking_date)', 'month')
      .addSelect('COUNT(booking.id)', 'total_bookings')
      .addSelect(
        'SUM(booking.unit_price * booking.ticket_quantity)',
        'total_revenue',
      )
      .addSelect('concert.date', 'concert')
      .addSelect('SUM(booking.ticket_quantity)', 'total_people')
      .addSelect('concert.price', 'unit_price')
      .leftJoin('booking.concert', 'concert')
      .leftJoin('booking.user', 'user')
      .leftJoin('user.companies', 'companies')
      .leftJoin('booking.payment', 'payment')
      .where('YEAR(booking.booking_date) = :year', { year })
      .andWhere('payment.status = :status', { status: 'success' })
      .groupBy('concert.id')
      .addGroupBy('concert.price')
      .addGroupBy('month')
      .orderBy('month', 'ASC')
      .addOrderBy('concert.date', 'DESC')
      .getRawMany();

    // สร้าง structure 1-12 เดือน
    const report: {
      year: number;
      month: number;
      details: {
        concert: any;
        total_people: number;
        total_bookings: number;
        unit_price: number;
        total_revenue: number;
      }[];
    }[] = [];
    for (let m = 1; m <= 12; m++) {
      const monthData = result
        .filter((r) => Number(r.month) === m)
        .map((r) => ({
          concert: dayjsUtil(r.concert),
          total_bookings: Number(r.total_bookings),
          total_people: Number(r.total_people),
          unit_price: Number(r.unit_price),
          total_revenue: Number(r.total_revenue),
        }));

      report.push({
        year,
        month: m,
        details: monthData,
      });
    }

    return report;
  }

async generateToExcel(year: number) {
    const report = await this.getMonthlyConcertReport(year);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Monthly Report');

    // ตั้งค่า properties ของ workbook
    workbook.creator = 'Concert Management System';
    workbook.lastModifiedBy = 'System';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    // กำหนดสี theme
    const colors = {
      primary: '4472C4', // น้ำเงิน
      secondary: 'E7E6E6', // เทาอ่อน
      accent: 'FFC000', // เหลือง
      success: '70AD47', // เขียว
      danger: 'C5504B', // แดง
      headerBg: '2F5597', // น้ำเงินเข้ม
      headerText: 'FFFFFF', // ขาว
    };

    // สร้าง styles
    const headerStyle = {
      fill: {
        type: 'pattern' as const,
        pattern: 'solid' as const,
        fgColor: { argb: colors.headerBg },
      },
      font: {
        name: 'Phetsarath OT',
        size: 12,
        bold: true,
        color: { argb: colors.headerText },
      },
      alignment: {
        horizontal: 'center' as const,
        vertical: 'middle' as const,
      },
      border: {
        top: { style: 'thin' as const, color: { argb: colors.primary } },
        left: { style: 'thin' as const, color: { argb: colors.primary } },
        bottom: { style: 'thin' as const, color: { argb: colors.primary } },
        right: { style: 'thin' as const, color: { argb: colors.primary } },
      },
    };

    const dataStyle = {
      font: {
        name: 'Phetsarath OT',
        size: 11,
      },
      alignment: {
        horizontal: 'center' as const,
        vertical: 'middle' as const,
      },
      border: {
        top: { style: 'thin' as const, color: { argb: 'D0D0D0' } },
        left: { style: 'thin' as const, color: { argb: 'D0D0D0' } },
        bottom: { style: 'thin' as const, color: { argb: 'D0D0D0' } },
        right: { style: 'thin' as const, color: { argb: 'D0D0D0' } },
      },
    };

    const numberStyle = {
      ...dataStyle,
      numFmt: '#,##0',
      alignment: {
        horizontal: 'right' as const,
        vertical: 'middle' as const,
      },
    };

    const currencyStyle = {
      ...dataStyle,
      numFmt: '#,##0" ກິບ"',
      alignment: {
        horizontal: 'right' as const,
        vertical: 'middle' as const,
      },
    };

    // เพิ่ม title
    worksheet.mergeCells('A1:G3');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `ລາຍງານການຈອງຄອນເສີດປະຈຳປີ ${year}`;
    titleCell.style = {
      font: {
        name: 'Phetsarath OT',
        size: 18,
        bold: true,
        color: { argb: colors.primary },
      },
      alignment: {
        horizontal: 'center' as const,
        vertical: 'middle' as const,
      },
      fill: {
        type: 'pattern' as const,
        pattern: 'solid' as const,
        fgColor: { argb: 'F8F9FA' },
      },
      border: {
        top: { style: 'thick' as const, color: { argb: colors.primary } },
        left: { style: 'thick' as const, color: { argb: colors.primary } },
        bottom: { style: 'thick' as const, color: { argb: colors.primary } },
        right: { style: 'thick' as const, color: { argb: colors.primary } },
      },
    };

    // กำหนดความสูงของ row title
    worksheet.getRow(1).height = 80;

    // เพิ่มช่องว่าง
    worksheet.addRow([]);

    // สร้าง header ที่ row 5
    const headerRow = worksheet.addRow([
      'ປີ',
      'ເດືອນ',
      'ວັນທີຈັດຄອນເສີດ',
      'ຈຳນວນການຈອງ',
      'ຈຳນວນຄົນຈອງ',
      'ລາຄາຕໍ່ຄົນ',
      'ລາຍໄດ້ລວມ',
    ]);

    // ใส่ style ให้ header
    headerRow.eachCell((cell) => {
      cell.style = headerStyle;
    });

    // กำหนดความสูงของ header
    headerRow.height = 35;

    // กำหนดความกว้างของ columns
    worksheet.columns = [
      { width: 12 }, // ປີ
      { width: 15 }, // ເດືອນ
      { width: 18 }, // ວັນທີຈັດຄອນເສີດ
      { width: 18 }, // ຈຳນວນການຈອງ
      { width: 18 }, // ຈຳນວນຄົນຈອງ
      { width: 18 }, // ລາຄາຕໍ່ຄົນ
      { width: 20 }, // ລາຍໄດ້ລວມ
    ];

    // เตรียมข้อมูลสำหรับ chart
    const monthlyData: Array<{
      month: number;
      totalRevenue: number;
      totalBookings: number;
    }> = [];

    // เติม data
    let totalRevenue = 0;
    let totalBookings = 0;
    let totalPeople = 0;

    report.forEach((monthData, index) => {
      const month = monthData.month;
      const details = monthData.details;

      let monthRevenue = 0;
      let monthBookings = 0;
      let monthPeople = 0;

      if (details.length === 0) {
        // ถ้าไม่มี concert ในเดือนนั้น
        const row = worksheet.addRow([year, month, 0, 0, 0, 0, 0]);
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1 || colNumber === 2 || colNumber === 3) {
            cell.style = dataStyle;
          } else if (colNumber === 6 || colNumber === 7) {
            cell.style = currencyStyle;
          } else {
            cell.style = numberStyle;
          }
        });
      } else {
        // ถ้ามี concert หลายตัวในเดือนนั้น
        details.forEach((d, detailIndex) => {
          const row = worksheet.addRow([
            detailIndex === 0 ? year : '', // แสดง year เฉพาะ row แรก
            detailIndex === 0 ? month : '', // แสดง month เฉพาะ row แรก
            d.concert,
            d.total_bookings,
            d.total_people,
            d.unit_price,
            d.total_revenue,
          ]);

          row.eachCell((cell, colNumber) => {
            if (colNumber === 1 || colNumber === 2 || colNumber === 3) {
              cell.style = dataStyle;
            } else if (colNumber === 6 || colNumber === 7) {
              cell.style = currencyStyle;
            } else {
              cell.style = numberStyle;
            }
          });

          monthRevenue += d.total_revenue;
          monthBookings += d.total_bookings;
          monthPeople += d.total_people;
        });
      }

      // เก็บข้อมูลสำหรับ chart
      monthlyData.push({
        month: month,
        totalRevenue: monthRevenue,
        totalBookings: monthBookings,
      });

      totalRevenue += monthRevenue;
      totalBookings += monthBookings;
      totalPeople += monthPeople;
    });

    // เพิ่ม summary row
    worksheet.addRow([]);
    const summaryRow = worksheet.addRow([
      'ລວມທັງໝົດ',
      '',
      '',
      totalBookings,
      totalPeople,
      '',
      totalRevenue,
    ]);

    summaryRow.eachCell((cell, colNumber) => {
      cell.style = {
        ...headerStyle,
        fill: {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: colors.accent },
        },
        font: {
          name: 'Phetsarath OT',
          size: 12,
          bold: true,
          color: { argb: '000000' },
        },
      };

      if (colNumber === 4 || colNumber === 5) {
        cell.numFmt = '#,##0';
      } else if (colNumber === 7) {
        cell.numFmt = '#,##0" ກິບ"';
      }
    });

    summaryRow.height = 25;

    // Merge cells สำหรับ summary
    worksheet.mergeCells(`A${summaryRow.number}:C${summaryRow.number}`);

    // เพิ่ม Charts
    if (monthlyData.length > 0) {
      // สร้าง worksheet สำหรับ charts
      const chartWorksheet = workbook.addWorksheet('Charts');

      // Chart 1: Monthly Revenue
      chartWorksheet.addRow(['ເດືອນ', 'ລາຍໄດ້']);
      monthlyData.forEach((data) => {
        chartWorksheet.addRow([`ເດືອນ ${data.month}`, data.totalRevenue]);
      });

      // Chart 2: Monthly Bookings (เริ่มจาก column D)
      chartWorksheet.getCell('D1').value = 'ເດືອນ';
      chartWorksheet.getCell('E1').value = 'ການຈອງ';
      monthlyData.forEach((data, index) => {
        chartWorksheet.getCell(`D${index + 2}`).value = `ເດືອນ ${data.month}`;
        chartWorksheet.getCell(`E${index + 2}`).value = data.totalBookings;
      });

      // กำหนด style สำหรับ chart headers
      ['A1', 'B1', 'D1', 'E1'].forEach((cellAddress) => {
        const cell = chartWorksheet.getCell(cellAddress);
        cell.style = headerStyle;
      });

      // กำหนดความกว้างของ columns ใน chart sheet
      chartWorksheet.columns = [
        { width: 15 }, // ເດືອນ
        { width: 20 }, // ລາຍໄດ້
        { width: 5 }, // spacer
        { width: 15 }, // ເດືອນ
        { width: 20 }, // ການຈອງ
      ];
    }

    // ตั้งค่าการพิมพ์
    worksheet.pageSetup = {
      paperSize: 9, // A4
      orientation: 'landscape',
      margins: {
        left: 0.7,
        right: 0.7,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
      printTitlesRow: '5:5', // header row จะแสดงในทุกหน้า
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    // เพิ่มข้อมูล metadata
    worksheet.headerFooter.oddHeader = `&C&18ລາຍງານການຈອງຄອນເສີດ ປີ ${year}`;
    worksheet.headerFooter.oddFooter = '&L&D &T&R&P / &N';

    // Freeze panes
    worksheet.views = [
      {
        // state: 'frozen',
        // xSplit: 0, // จำนวน column ที่ freeze
        // ySplit: 5, // จำนวน row ที่ freeze (header row 5)
        showGridLines: false,
        zoomScale: 90,
        showRowColHeaders: false,
      },
    ];

    // Export เป็น buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async getbookingReportByDate(user: PayloadDto, start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const company_exists = await this.companyRepo.findOne({
      where: { id: user.company },
    });
    if (!company_exists) throw new NotFoundException('Company not found');

    const totalBookings = await this.bookingRepo.count({
      where: {
        user: { companies: { id: user.company } },
        createdAt: Between(startDate, endDate),
      },
    });
    return { campany: company_exists.name, total_bookings: totalBookings || 0 };
  }
}
