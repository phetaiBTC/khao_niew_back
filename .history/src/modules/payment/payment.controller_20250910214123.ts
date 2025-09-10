import { Controller, Patch, Param, Body, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentStatus } from './entities/payment.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Patch(':id/status')
    async updateStatus( @Body() body : UpdatePaymentDto
    ) {
        return this.paymentService.updateStatus(body.id, body.status);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.paymentService.delete(id);
    }
}
