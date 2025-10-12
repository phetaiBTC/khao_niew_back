import { Controller, Get, Query } from '@nestjs/common';
import { sendMail } from 'src/common/utils/sendMail';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('send-test')
  async sendTestEmail() {
    const to = 'uablauj@gmail.com';
    await this.mailService.sendMail(
      to,
      'Welcome to our platform',
      'booking',
      {
        name: 'Tester',
        concert: 'http://localhost:3000/verify/test-token',
        bookingId: '123456',
      },
    );

    return { message: 'Email sent (check your inbox)' };
  }
}
