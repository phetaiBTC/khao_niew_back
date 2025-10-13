import { Injectable } from '@nestjs/common';
import { CompanySeederService } from './seeder/company.seeder';
import { DataSource } from 'typeorm';
import { UserSeederService } from './seeder/user.seeder.';

@Injectable()
export class SeederService {
  constructor(
    private readonly companySeeder: CompanySeederService,
    private readonly userSeeder: UserSeederService,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    return this.dataSource.transaction(async (manager) => {
      const { company } = await this.companySeeder.seed(manager);
      await this.userSeeder.seed(manager, company);
      return { message: 'Database seeded successfully' };
    });
  }
}
