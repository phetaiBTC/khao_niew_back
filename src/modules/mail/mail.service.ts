// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import sgMail from '@sendgrid/mail';
import { baseEnv } from 'src/besa.env';
import { readFileSync } from 'fs';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
@Injectable()
export class MailService {
  private resend: Resend;
  constructor(private readonly mailerService: MailerService) {
    sgMail.setApiKey(baseEnv.SENDGRID_API_KEY as string);
    this.resend = new Resend(baseEnv.RESEND_API_KEY);
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

  private renderTemplate(templateName: string, context: any): string {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      `${templateName}.hbs`,
    );
    const source = readFileSync(filePath, 'utf8');
    const compiled = Handlebars.compile(source);
    return compiled(context);
  }

  async sendMailResend(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ) {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      `${templateName}.hbs`,
    );

    console.log(templatePath);

    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    const html = template(context);

    try {
      await this.resend.emails.send({
        from: baseEnv.RESEND_FROM,
        // from: 'uablauj76681809@gmail.com',
        to,
        subject,
        html,
      });

      console.log(`✅ Email sent to ${to}`);
    } catch (error) {
      console.error('❌ Error sending email:', error);
    }
  }
}
