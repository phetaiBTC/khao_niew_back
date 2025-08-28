import { Injectable, NotFoundException } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { BookingDetail } from './entities/bookingDetails.entity';
import * as crypto from 'crypto';

@Injectable()
export class BookingDetailsService {

      constructor(
        @InjectRepository(BookingDetail)
        private readonly bookingDetailRepository: Repository<BookingDetail>,
      ) {}
      async validateQrCode(ticketCode: string) {
        try {
          console.log('Searching for ticket code:', ticketCode);
          
          // Find the booking detail by ticket code
          const bookingDetail = await this.bookingDetailRepository.findOne({
            where: { ticket_code: ticketCode },
            relations: ['booking', 'booking.user', 'booking.concert', 'booking.payment']
          });
    
          if (!bookingDetail) {
            console.log('Booking detail not found for ticket code:', ticketCode);
            throw new NotFoundException('Invalid ticket code - booking detail not found');
          }
    
          console.log('Found booking detail:', {
            id: bookingDetail.id,
            ticketCode: bookingDetail.ticket_code,
            bookingId: bookingDetail.booking?.id
          });
    
          try {
            // Extract ticket information from the ticket code
            const [bookingId, ticketNumber] = ticketCode.split('-').map(Number);
            
            if (!bookingId || !ticketNumber) {
              throw new Error('Invalid ticket code format');
            }
    
            // Create QR code data object based on the booking details
            const qrCodeData = {
              bookingId: bookingDetail.booking.id,
              ticketCode: bookingDetail.ticket_code,
              concertId: bookingDetail.booking.concert.id,
              ticketNumber: ticketNumber,
              totalTickets: bookingDetail.booking.ticket_quantity,
              concertDate: bookingDetail.booking.concert.date,
              userId: bookingDetail.booking.user.id,
              bookingDate: bookingDetail.booking.booking_date,
            };
            
            console.log('Generated QR data:', qrCodeData);
    
            // Generate verification hash
            const calculatedHash = crypto
              .createHash('sha256')
              .update(`${ticketCode}-${bookingDetail.booking.id}-${bookingDetail.booking.concert.id}`)
              .digest('hex');
            
            // Add hash to QR code data
            qrCodeData['hash'] = calculatedHash;
            
            console.log('Verification hash:', calculatedHash);
    
            // Return ticket information
            return {
              ticketDetail: {
                ticketCode: bookingDetail.ticket_code,
                ticketNumber: qrCodeData.ticketNumber,
                totalTickets: qrCodeData.totalTickets,
              },
              booking: {
                id: bookingDetail.booking.id,
                bookingDate: bookingDetail.booking.booking_date,
                totalAmount: bookingDetail.booking.total_amount,
              },
              concert: {
                id: bookingDetail.booking.concert.id,
                date: qrCodeData.concertDate,
              },
              user: {
                id: bookingDetail.booking.user.id,
              },
              payment: {
                id: bookingDetail.booking.payment.id,
                status: bookingDetail.booking.payment.status,
              },
              qrCodeData: qrCodeData, // Include raw QR data for debugging
              isValid: true
            };
          } catch (parseError) {
            console.error('Error parsing QR code data:', parseError);
            throw new NotFoundException(`Error parsing QR code: ${parseError.message}`);
          }
        } catch (error) {
          console.error('Error in validateQrCode:', error);
          if (error instanceof NotFoundException) {
            throw error;
          }
          throw new NotFoundException(`Invalid QR code format: ${error.message}`);
        }
      }
}
