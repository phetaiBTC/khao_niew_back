// booking.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from 'src/modules/mail/mail.service';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('booking.created')
  async handleBookingCreated(booking : Booking) {
  const context = {
    name: booking.user.username || 'Unknown',
    concert: booking.concert.date || 'Unknown Concert',
    bookingId: booking.id,
    ticketQuantity: booking.ticket_quantity,
    totalAmount: booking.total_amount,
  };
    await this.mailService.sendMail(
       'uablauj76681809@gmail.com',
      'ມີການຈອງໃຫມ່ - Khao Niew',
      'booking',
      context,
    );
  }
}
