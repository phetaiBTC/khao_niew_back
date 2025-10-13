// src/seeder/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EnumRole, User } from 'src/modules/users/entities/user.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';

@Injectable()
export class SeederService {
  constructor(private dataSource: DataSource) {}

  async seed() {
    return this.dataSource.transaction(async (manager) => {
 
      const existingCompany = await manager.findOne(Company, {
        where: { name: 'KhaoNiew Co Ltd' },
      });
      const existingCustomerCompany = await manager.findOne(Company, {
        where: { name: 'customer' },
      });

      const company =
        existingCompany ||
        (await manager.save(
          manager.create(Company, {
            name: 'KhaoNiew Co., Ltd',
            contact: '1234567890',
          }),
        ));

      const company2 =
        existingCustomerCompany ||
        (await manager.save(
          manager.create(Company, {
            name: 'customer',
            contact: '0987654321',
          }),
        ));

     
      const existingUser = await manager.findOne(User, {
        where: { email: 'admin@gmail.com' },
      });

      if (!existingUser) {
        const user = manager.create(User, {
          username: 'admin',
          phone: '02012345678',
          email: 'admin@gmail.com',
          password: await bcryptUtil.hash('password'),
          role: EnumRole.ADMIN,
          companies: company,
        });
        await manager.save(user);
      }

      return {
        message: 'Database seeded successfully',
      };
    });
  }
}
