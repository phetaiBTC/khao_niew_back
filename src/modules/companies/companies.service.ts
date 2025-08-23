import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { paginateUtil } from 'src/common/utils/paginate.util';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private dataSource: DataSource
  ) { }
  create(createCompanyDto: CreateCompanyDto) {
    {
      return this.dataSource.transaction(async (manager) => {
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
          companies: company
        });
        await manager.save(user);
        return {
          message: 'Company created successfully',
        };
      });
    }
  }

  async findAll(query: PaginateDto) {
    const qb = this.companyRepository.createQueryBuilder('company').leftJoinAndSelect('company.user', 'user');
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
      relations: ['user']
    });
    if (!company) throw new NotFoundException('Company not found')
    return company
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id)
    await this.companyRepository.update({ id }, {
      name: updateCompanyDto.name,
      contact: updateCompanyDto.contact
    });
    return {
      message: 'Company updated successfully'
    }
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.companyRepository.delete({ id })
    return {
      message: 'Company deleted successfully'
    }
  }
}
