import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';
import { PaginateDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto) {
    const EmailExists = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email
      }
    })
    if (EmailExists) {
      throw new BadRequestException('Email already exists')
    }
    await this.usersRepository.save({
      ...createUserDto,
      password: await bcryptUtil.hash(createUserDto.password)
    })
    return {
      message: 'User created successfully'
    }
  }

  async findAll(query: PaginateDto) {
    const page = query.page || 1
    const per_page = query.per_page || 10
    const search = query.search
    const qp = this.usersRepository.createQueryBuilder('user')
    if (search) {
      qp.where('user.username LIKE :search OR user.email LIKE :search', { search: `%${search}%` })
    }
    const [users, total] = await qp
      .skip((page - 1) * per_page)
      .take(per_page)
      .getManyAndCount()
    return {
      data: users,
      pagination: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page)
      }
    }
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id })
    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user
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
    const user = await this.usersRepository.findOneBy({ email })
    if (!user) {
      throw new BadRequestException('User not found')
    }
    return user
  }
}
