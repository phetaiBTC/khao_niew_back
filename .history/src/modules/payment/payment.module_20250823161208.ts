import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
