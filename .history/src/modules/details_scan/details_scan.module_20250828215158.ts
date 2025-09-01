import { Module } from '@nestjs/common';
import { DetailsScanService } from './details_scan.service';
import { DetailsScanController } from './details_scan.controller';
import { Type } from 'class-transformer';

@Module({
  imports: [Type],
  controllers: [DetailsScanController],
  providers: [DetailsScanService],
})
export class DetailsScanModule {}
