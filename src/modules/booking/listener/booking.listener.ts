// booking.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from 'src/modules/mail/mail.service';
import { Booking } from '../entities/booking.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { baseEnv } from 'src/besa.env';

@Injectable()
export class BookingListener {
  constructor(private readonly mailService: MailService) {}

  @OnEvent('booking.created')
  async handleBookingCreated(booking: Booking, user: User) {
    const context = {
      name: user.username || 'Unknown',
      concert: booking.concert.date || 'Unknown Concert',
      bookingId: booking.id,
      ticketQuantity: booking.ticket_quantity,
      totalAmount: booking.total_amount,
    };
    await this.mailService.sendMail(
      baseEnv.SMTP_USER,
      'ມີການຈອງໃຫມ່ - Khao Niew',
      'booking',
      context,
    );
  }
}
