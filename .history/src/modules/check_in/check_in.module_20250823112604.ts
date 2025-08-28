import { Module } from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { CheckInController } from './check_in.controller';

@Module({
  controllers: [CheckInController],
  providers: [CheckInService],
})
export class CheckInModule {}
