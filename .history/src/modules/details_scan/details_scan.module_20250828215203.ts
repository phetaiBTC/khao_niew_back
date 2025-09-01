import { Module } from '@nestjs/common';
import { DetailsScanService } from './details_scan.service';
import { DetailsScanController } from './details_scan.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DetailsScan])],
  controllers: [DetailsScanController],
  providers: [DetailsScanService],
})
export class DetailsScanModule {}
