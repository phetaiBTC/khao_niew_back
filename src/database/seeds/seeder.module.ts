// src/seeder/seeder.module.ts
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { CompanySeederService } from './seeder/company.seeder';
import { UserSeederService } from './seeder/user.seeder.';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeederService,CompanySeederService, UserSeederService],
  exports: [SeederService],
})
export class SeederModule {}
