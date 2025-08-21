import { Module } from '@nestjs/common';
import { EntertainmentsService } from './entertainments.service';
import { EntertainmentsController } from './entertainments.controller';

@Module({
  controllers: [EntertainmentsController],
  providers: [EntertainmentsService],
})
export class EntertainmentsModule {}
