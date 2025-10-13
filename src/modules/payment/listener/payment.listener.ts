// booking.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class PaymentListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('payment.successful')
  async handleBookingCreated(booking : Booking) {
  const context = {
    name: booking.user.username || 'Unknown',
    concert: booking.concert.date || 'Unknown Concert',
    bookingId: booking.id,
    ticketQuantity: booking.ticket_quantity,
    totalAmount: booking.total_amount,
    payment: booking.payment.status,
    detailsIds : booking.details.map(detail => detail.id)

  };
    await this.mailService.sendMail(
       booking.user.email,
      'ຢີນຢົັນການຂອງສຳເລັດ - Khao Niew',
      'payment',
      context,
    );
  }
}
