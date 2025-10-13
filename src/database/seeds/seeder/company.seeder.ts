import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class CompanySeederService {
  async seed(manager: EntityManager) {
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

    return { company, company2 };
  }
}
