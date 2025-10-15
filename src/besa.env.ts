import * as dotenv from 'dotenv';
dotenv.config();

export const baseEnv = {
  // Application
  PORT: process.env.PORT || 3000,

  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'khaoniew',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'phet',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3d',

  // Email
  EMAIL_USER: process.env.EMAIL_USER || 'uablauj76681809@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'uwsjsuhoxyrycmrp',

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || 'uablauj76681809@gmail.com',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'uwsjsuhoxyrycmrp',
  SMTP_FROM: process.env.SMTP_FROM || 'uablauj76681809@gmail.com',

  // SendGrid email
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL:
    process.env.SENDGRID_FROM_EMAIL || 'uablauj76681809@gmail.com',

  // Resend
  RESEND_API_KEY: process.env.RESEND_API_KEY || 're_UcCkyDo6_AjyevuoJSBENLaQZxDH9K4wQ',
  RESEND_FROM: process.env.RESEND_FROM || 'onboarding@resend.dev',
  RESEND_EMAIL: process.env.RESEND_EMAIL || 'akhaoniew@gmail.com',

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
