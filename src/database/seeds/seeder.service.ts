// src/seeder/seeder.service.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EnumRole, User } from 'src/modules/users/entities/user.entity';
import { bcryptUtil } from 'src/common/utils/bcrypt.util';

@Injectable()
export class SeederService {
  constructor(private dataSource: DataSource) {}

  async seed() {
    const userRepository = this.dataSource.getRepository(User);

    const adminExists = await userRepository.findOne({ where: { email: 'admin@gmail.com' } });
    if (!adminExists) {
      const admin = userRepository.create({
        username: 'Admin',
        email: 'admin@gmail.com',
        password: await bcryptUtil.hash('admin@123'),
        phone: '02088888888',
        role: EnumRole.ADMIN,
      });
      await userRepository.save(admin);
      console.log('Admin user created');
    } else {
      console.log('Admin already exists');
    }

    // เพิ่ม seed user ตัวอย่าง
    // const companyUserExists = await userRepository.findOne({ where: { email: 'test@gmail.com' } });
    // if (!companyUserExists) {
    //   const company = userRepository.create({
    //     username: 'Tester',
    //     email: 'test@gmail.com',
    //     password: await bcryptUtil.hash('test@gmail.com'),
    //     phone: '02088888888',
    //     role: EnumRole.COMPANY,
    //   });
    //   await userRepository.save(company);
    //   console.log('Company user created');
    // }
  }
}
