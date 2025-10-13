import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EnumRole, User } from 'src/modules/users/entities/user.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';

@Injectable()
export class UserSeederService {
  async seed(manager: EntityManager, company: Company) {
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
  }
}
