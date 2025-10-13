import { Controller, Get, Query } from '@nestjs/common';
import { sendMail } from 'src/common/utils/sendMail';
import { MailService } from './mail.service';
import sgMail from '@sendgrid/mail';
import { baseEnv } from 'src/besa.env';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {
    sgMail.setApiKey(baseEnv.SENDGRID_API_KEY as string);
  }

  @Get('send-test')
  async sendTestEmail() {
    const to = 'uablauj@gmail.com';
    await this.mailService.sendMail(to, 'Welcome to our platform', 'booking', {
      name: 'Tester',
      concert: 'http://localhost:3000/verify/test-token',
      bookingId: '123456',
    });

    return { message: 'Email sent (check your inbox)' };
  }

  @Get('send')
  async send() {
    await sgMail.send({
      to: 'test@example.com',
      from: 'uablauj76681809@gmail.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
    });
  }
}
