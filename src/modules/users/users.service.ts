import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { plainToInstance } from 'class-transformer';
import { paginateUtil } from 'src/common/utils/paginate.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto,companyId:number) {
    const EmailExists = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })
    if (EmailExists) {
      throw new BadRequestException('Email already exists')
    }
    const user = this.usersRepository.create({
      ...createUserDto,
      companies: { id: companyId ? companyId : createUserDto.companyId},
      password: await bcryptUtil.hash(createUserDto.password),
    })
    await this.usersRepository.save(user)
    return {
      message: 'User created successfully'
    }
  }

  async findAll(query: PaginateDto) {
    const qb = this.usersRepository.createQueryBuilder('user');
    if (query.search) {
      qb.where('user.username LIKE :search OR user.email LIKE :search', {
        search: `%${query.search}%`,
      });
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
    const user = await this.usersRepository.findOne({ where: { email },relations: ['companies'] })
    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user
  }
}
