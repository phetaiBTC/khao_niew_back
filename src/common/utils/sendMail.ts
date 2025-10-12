import { MailerService } from '@nestjs-modules/mailer';

export async function sendMail(
  mailService: MailerService,
  to: string,
  subject: string,
  template: string,
  context: Record<string, any>,
): Promise<void> {
  await mailService.sendMail({
    to,
    subject,
    template, // เช่น 'welcome' ตรงกับ welcome.hbs
    context,  // เช่น { name: 'Juan', url: '...' }
  });
}
