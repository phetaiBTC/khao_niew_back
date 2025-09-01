import { Module } from '@nestjs/common';
import { DetailsScanService } from './details_scan.service';
import { DetailsScanController } from './details_scan.controller';

@Module({
  imports: [],
  controllers: [DetailsScanController],
  providers: [DetailsScanService],
})
export class DetailsScanModule {}
