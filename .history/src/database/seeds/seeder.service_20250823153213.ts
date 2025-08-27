// src/seeder/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EnumRole, User } from 'src/modules/users/entities/user.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';

@Injectable()
export class SeederService {
  constructor(private dataSource: DataSource) { }
  async seed() {
    return this.dataSource.transaction(async (manager) => {
      const company = manager.create(Company, {
        name: 'KhaoNiew Co.,Ltd',
        contact: '1234567890',
      });
      await manager.save(company);
      const user = manager.create(User, {
        username: 'admin',
        phone: '02012345678',
        email: 'admin@gmail.com',
        password: await bcryptUtil.hash('password'),
        role: EnumRole.ADMIN,
        companies: company
      });
      await manager.save(user);
      return {
        message: 'Database seeded successfully',
      };
    })
  }
}
