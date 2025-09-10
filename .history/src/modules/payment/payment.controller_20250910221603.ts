import { Controller, Patch, Param, Body, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Patch('status/:id')
    async updateStatus(@Param('id') id: number, @Body() body : UpdatePaymentDto
    ) {
        return this.paymentService.updateStatus( id, body);
    }

    @Delete('payment-delete/:id')
    async delete(@Param('id') id: number) {
        return this.paymentService.delete(id);
    }
}
