import { Module } from '@nestjs/common';
import { DetailsScanService } from './details_scan.service';
import { DetailsScanController } from './details_scan.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailsScan } from './entities/details_scan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailsScan])],
  controllers: [DetailsScanController],
  providers: [DetailsScanService],
  exports: [DetailsScanService],
})
export class DetailsScanModule {}
