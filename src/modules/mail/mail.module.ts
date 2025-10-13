import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { baseEnv } from 'src/besa.env';


@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        global: true,
        transport: {
          host: baseEnv.SMTP_HOST,
          port: baseEnv.SMTP_PORT as number,
          secure: baseEnv.SMTP_SECURE as boolean,
          auth: {
            user: baseEnv.SMTP_USER,
            pass: baseEnv.SMTP_PASSWORD,

          },
          connectionTimeout: 20000,
        },
        defaults: {
          from: baseEnv.SMTP_FROM,
        },
        template: {
          dir: join(process.cwd(), 'src', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],

  controllers: [MailController],
  providers: [ MailService ],
  exports: [MailService],
})
export class MailModule {}
