import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { AuthProfile } from 'src/common/decorator/user.decorator';
import { PayloadDto } from '../auth/dto/auth.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { EnumRole } from '../users/entities/user.entity';
import { CompaniesProfilereportDto } from './dto/companies-profilereport.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Post()
  create(@Body() createCompanyDto: any) {
    return this.companiesService.create(createCompanyDto);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get()
  findAll(@Query() query: PaginateDto) {
    return this.companiesService.findAll(query);
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get('company-proflie')
  async getRevenueByCompany(
    @Query('id') id: number,
    @AuthProfile() user: PayloadDto,
    @Body() body: CompaniesProfilereportDto,
  ) {
    return await this.companiesService.getCompaniesProfileReport(
      +id,
      user,
      body,
    );
  }

  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }
  @Roles(EnumRole.ADMIN, EnumRole.COMPANY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
