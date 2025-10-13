// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import sgMail from '@sendgrid/mail';
import { baseEnv } from 'src/besa.env';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
    sgMail.setApiKey(baseEnv.SENDGRID_API_KEY as string);
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (error) {
      throw error;
    }
  }

  async sendMailSendGridTemplate(
    to: string,
    subject: string,
    templateId: string,
    context: Record<string, any>,
  ) {
    const msg = {
      to,
      from: baseEnv.SENDGRID_FROM_EMAIL,
      subject,
      templateId, // ID ของ template ใน SendGrid
      dynamic_template_data: context, // context ของคุณ
    };
    try {
      await sgMail.send(msg);
      console.log('Mail sent successfully with template');
    } catch (error) {
      console.error('Error sending mail:', error);
      throw error;
    }
  }
}
