import { Controller, Patch, Param, Body, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentStatus } from './entities/payment.entity';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Patch(':id/status')
    async updateStatus( @
    ) {
        return this.paymentService.updateStatus(id, status);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.paymentService.delete(id);
    }
}
