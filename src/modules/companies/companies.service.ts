import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getCompaniesProfileReport(id: number, user: PayloadDto) {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .select([])
      .leftJoin('company.user', 'user')
      .leftJoin('user.bookings', 'booking')
      .leftJoin('booking.payment', 'payment')
      .leftJoin('booking.concert', 'concert')
      .addSelect('company.id', 'company_id')
      .addSelect('company.name', 'company_name')
      .addSelect('COUNT(DISTINCT user.id)', 'total_users')
      .addSelect('COUNT(DISTINCT booking.id)', 'total_bookings')
      .addSelect(
        'COALESCE(SUM(booking.unit_price * booking.ticket_quantity), 0)',
        'total_revenue',
      )
      .addSelect('COALESCE(SUM(booking.ticket_quantity), 0)', 'total_people')
      .addSelect(
        `SUM(CASE WHEN payment.status = 'pending' THEN 1 ELSE 0 END)`,
        'total_pending',
      )
      .addSelect(
        `SUM(CASE WHEN payment.status = 'success' THEN 1 ELSE 0 END)`,
        'total_success',
      )
      .addSelect(
        `SUM(CASE WHEN payment.status = 'failed' THEN 1 ELSE 0 END)`,
        'total_failed',
      )
      .groupBy('company.id')
      .orderBy('total_revenue', 'DESC');

    if (user.role === EnumRole.ADMIN) {
      query.andWhere('company.id = :companyId', { companyId: id });
    } else if (user.role === EnumRole.COMPANY && user.company) {
      query.andWhere('company.id = :companyId', { companyId: user.company });
    }

    const result = await query.getRawMany();

    return result.map((r) => ({
      company: { id: r.company_id, name: r.company_name },
      total_users: Number(r.total_users || 0),
      total_bookings: Number(r.total_bookings || 0),
      total_people: Number(r.total_people || 0),
      total_revenue: Number(r.total_revenue || 0),
      total_pending: Number(r.total_pending || 0),
      total_success: Number(r.total_success || 0),
      total_failed: Number(r.total_failed || 0),
    }));
  }
}
