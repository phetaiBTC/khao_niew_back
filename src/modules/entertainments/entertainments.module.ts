import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entertainment } from './entities/entertainment.entity';
import { EntertainmentsController } from './entertainments.controller';
import { EntertainmentsService } from './entertainments.service';
import { Concert } from '../concerts/entities/concert.entity';
import { Image } from '../images/entities/image.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Entertainment, Concert, Image])],  
  controllers: [EntertainmentsController],
  providers: [EntertainmentsService],
})
export class EntertainmentsModule {}
