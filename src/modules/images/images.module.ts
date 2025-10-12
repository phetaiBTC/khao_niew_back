// src/modules/images/image.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Venue } from '../venue/entities/venue.entity';
import { Entertainment } from '../entertainments/entities/entertainment.entity';
import { ImageService } from './images.service';
import { ImageController } from './images.controller';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Venue, Entertainment,Payment])],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImagesModule {}
