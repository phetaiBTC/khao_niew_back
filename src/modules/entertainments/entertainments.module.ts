import { Module } from '@nestjs/common';
import { EntertainmentsService } from './entertainments.service';
import { EntertainmentsController } from './entertainments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entertainment } from './entities/entertainment.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Entertainment])],  
  controllers: [EntertainmentsController],
  providers: [EntertainmentsService],
})
export class EntertainmentsModule {}
