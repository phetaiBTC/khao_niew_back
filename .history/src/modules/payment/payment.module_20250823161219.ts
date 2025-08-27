import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Pay])],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
