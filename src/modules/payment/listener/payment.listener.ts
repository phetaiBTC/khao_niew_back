// booking.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
export class PaymentListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('payment.successful')
  async handleBookingCreated(booking: Booking) {
    console.log('start payment listener');
    const context = {
      name: booking.user.username || 'Unknown',
      concert: booking.concert.date || 'Unknown Concert',
      bookingId: booking.id,
      ticketQuantity: booking.ticket_quantity,
      totalAmount: booking.total_amount,
      payment: booking.payment.status,
      detailsIds: booking.details.map((detail) => detail.id),
    };
    // await this.mailService.sendMail(
    //   booking.user.email,
    //   'ຢີນຢົັນການຂອງສຳເລັດ - Khao Niew',
    //   'payment',
    //   context,
    // );

    // const context = {
    //   name: 'Muaj Hmoos',
    //   concert: 'Khao Niew Live 2025',
    //   bookingId: 'B12345',
    //   ticketQuantity: 2,
    //   totalAmount: 300000,
    //   payment: 'PAID',
    //   detailsIds: ['QR001', 'QR002'],
    // };
    await this.mailService.sendMailResend(
      booking.user.email,
      'ຢີນຢົັນການຂອງສຳເລັດ - Khao Niew',
      'payment',
      context,
    );
    return 'Mail sent';

    // console.log('Booking ID: ', booking.id);

    // await this.mailService.sendMailSendGridTemplate(
    //   booking.user.email,
    //   'ຢີນຢົັນການຂອງສຳເລັດ - Khao Niew',
    //   'd-375c1c526f7947a58bf415ab362623e0', // template ID ของคุณ
    //   context,
    // );
    // console.log('Mail sent successfully');
  }
}
