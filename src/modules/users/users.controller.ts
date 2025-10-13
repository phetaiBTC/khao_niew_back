import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { Public } from 'src/common/decorator/auth.decorator';
import { AuthProfile } from 'src/common/decorator/user.decorator';
import { PayloadDto } from '../auth/dto/auth.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { EnumRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @AuthProfile() user: PayloadDto) {
    return this.usersService.create(createUserDto, user.company);
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, 0);
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get()
  findAll(@Query() query: PaginateDto, @AuthProfile() user: PayloadDto) {
    return this.usersService.findAll(query, user);
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
