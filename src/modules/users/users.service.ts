import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EnumRole, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { plainToInstance } from 'class-transformer';
import { paginateUtil } from 'src/common/utils/paginate.util';
import { Company } from '../companies/entities/company.entity';
import { PayloadDto } from '../auth/dto/auth.dto';
import { Roles } from 'src/common/decorator/role.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) { }

  async create(createUserDto: CreateUserDto, companyId: number) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    let assignedCompanyId: number;

    if (companyId == 0 || companyId == null) {
      const publicCompany = await this.companyRepository.findOne({
        where: { name: 'customer' },
      });

      if (!publicCompany) {
        throw new NotFoundException('Public company not found');
      }

      assignedCompanyId = publicCompany.id;
    } else {
      assignedCompanyId = companyId ?? createUserDto.companyId;
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      companies: { id: assignedCompanyId },
      password: await bcryptUtil.hash(createUserDto.password),
    });

    await this.usersRepository.save(user);

    return {
      message: 'User created successfully',
      user,
    };
  }



  async findAll(query: PaginateDto, user: PayloadDto) {
    const qb = this.usersRepository.createQueryBuilder('user');
    qb.leftJoinAndSelect('user.companies', 'companies');
    if (query.search) {
      qb.where('user.username LIKE :search OR user.email LIKE :search', {
        search: `%${query.search}%`,
      });
    }
    if (user.role === EnumRole.COMPANY) {
      qb.andWhere('user.companies.id = :companyId', { companyId: user.company });
    }


    return paginateUtil(qb, query);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id)
    await this.usersRepository.update({ id }, updateUserDto)
    return {
      message: 'User updated successfully'
    }
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.usersRepository.delete({ id })
    return {
      message: 'User deleted successfully'
    }
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email }, relations: ['companies'] })
    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user
  }

async createPublicUser(username: string, email: string) {
  
  const existingUser = await this.usersRepository.findOne({ 
    where: { email } 
  });
  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }


  const publicCompany = await this.companyRepository.findOne({
    where: { name: 'customer' },
  });
  if (!publicCompany) {
    throw new NotFoundException('Public company not found');
  }

  const hashedPassword = await bcryptUtil.hash('12345');
  const user = this.usersRepository.create({
    username,
    email,
    phone: '1234567890',
    role: EnumRole.COMPANY,
    password: hashedPassword,
    companies: publicCompany
  });

  await this.usersRepository.save(user);

  return {
    message: 'User created successfully',
    user,
  };
}


}
