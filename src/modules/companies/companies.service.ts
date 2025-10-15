import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { DataSource } from 'typeorm';
import { EnumRole, User } from '../users/entities/user.entity';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { paginateUtil } from 'src/common/utils/paginate.util';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
import { PayloadDto } from '../auth/dto/auth.dto';
import { PaymentStatus } from '../payment/entities/payment.entity';
import { CompaniesProfilereportDto } from './dto/companies-profilereport.dto';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private dataSource: DataSource,
  ) {}
  create(createCompanyDto: CreateCompanyDto) {
    {
      return this.dataSource.transaction(async (manager) => {
        const existingCompany = await manager.findOne(Company, {
          where: { name: createCompanyDto.name },
        });
        if (existingCompany) {
          throw new NotFoundException('Company already exists');
        }
        const company = manager.create(Company, {
          name: createCompanyDto.name,
          contact: createCompanyDto.contact,
        });
        await manager.save(company);
        const user = manager.create(User, {
          username: createCompanyDto.user.username,
          phone: createCompanyDto.user.phone,
          email: createCompanyDto.user.email,
          password: await bcryptUtil.hash(createCompanyDto.user.password),
          companies: company,
        });
        await manager.save(user);
        return {
          message: 'Company created successfully',
        };
      });
    }
  }

  async findAll(query: PaginateDto) {
    const qb = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.user', 'user');
    if (query.search) {
      qb.where('company.name LIKE :search', {
        search: `%${query.search}%`,
      });
    }
    return await paginateUtil(qb, query);
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);
    await this.companyRepository.update(
      { id },
      {
        name: updateCompanyDto.name,
        contact: updateCompanyDto.contact,
      },
    );
    return {
      message: 'Company updated successfully',
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.companyRepository.delete({ id });
    return {
      message: 'Company deleted successfully',
    };
  }

  async getCompaniesProfileReport(
    id: number,
    user: PayloadDto,
    body: CompaniesProfilereportDto,
  ) {
    let targetCompanyId: number | null = null;

    if (user.role === EnumRole.ADMIN) {
      targetCompanyId = id ?? user.id;
    } else if (user.role === EnumRole.COMPANY) {
      if (!user.company) {
        throw new ForbiddenException('Company ID ไม่พบในข้อมูลผู้ใช้');
      }
      targetCompanyId = user.company;
    } else {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงรายงานนี้');
    }

    const companyExists = await this.companyRepository.exists({
      where: { id: targetCompanyId },
    });

    if (!companyExists) {
      throw new NotFoundException(`ไม่พบบริษัท ID ${targetCompanyId}`);
    }

    const query = this.companyRepository
      .createQueryBuilder('company')
      .select([
        'company.id AS company_id',
        'company.name AS company_name',
        'COUNT(DISTINCT user.id) AS total_users',
        'COUNT(DISTINCT booking.id) AS total_bookings',
        'COALESCE(SUM(booking.ticket_quantity), 0) AS total_people',
        'COALESCE(SUM(booking.total_amount), 0) AS total_revenue',
      ])
      .addSelect(
        `COALESCE(SUM(CASE WHEN payment.status = '${PaymentStatus.PENDING}' THEN 1 ELSE 0 END), 0)`,
        'total_pending',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN payment.status = '${PaymentStatus.SUCCESS}' THEN 1 ELSE 0 END), 0)`,
        'total_completed',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN payment.status = '${PaymentStatus.FAILED}' THEN 1 ELSE 0 END), 0)`,
        'total_failed',
      )
      .leftJoin('company.user', 'user')
      .leftJoin('user.bookings', 'booking')
      .leftJoin('booking.payment', 'payment')
      .leftJoin('booking.concert', 'concert')
      .where('company.id = :companyId', { companyId: targetCompanyId });

    if (body.start_date) {
      query.andWhere('booking.createdAt >= :startDate', {
        startDate: body.start_date,
      });
    }
    if (body.end_date) {
      query.andWhere('booking.createdAt <= :endDate', {
        endDate: body.end_date,
      });
    }

    query.groupBy('company.id').addGroupBy('company.name');

    const result = await query.getRawOne();

    if (!result || !result.company_id) {
      const company = await this.companyRepository.findOne({
        where: { id: targetCompanyId },
        select: ['id', 'name'],
      });

      return {
        company: {
          id: company!.id,
          name: company!.name,
        },
        statistics: {
          total_users: 0,
          total_bookings: 0,
          total_people: 0,
          total_revenue: 0,
        },
        payment_status: {
          pending: 0,
          completed: 0,
          failed: 0,
          cancelled: 0,
        },
      };
    }

    return {
      company: {
        id: Number(result.company_id),
        name: result.company_name,
      },
      statistics: {
        total_users: Number(result.total_users || 0),
        total_bookings: Number(result.total_bookings || 0),
        total_people: Number(result.total_people || 0),
        total_revenue: Number(result.total_revenue || 0),
      },
      payment_status: {
        pending: Number(result.total_pending || 0),
        completed: Number(result.total_completed || 0),
        failed: Number(result.total_failed || 0),
      },
    };
  }
}
