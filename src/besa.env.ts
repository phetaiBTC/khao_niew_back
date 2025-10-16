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

  // WASABI
  WASABI_ACCESS_KEY: process.env.WASABI_ACCESS_KEY || 'UX3H7A8UYQLPGNEJ3G0F',
  WASABI_SECRET_KEY: process.env.WASABI_SECRET_KEY || '8eKgRVmyb3zWfle7vulLSiOBMLdaeMHznVntAK8V',
  WASABI_BUCKET: process.env.WASABI_BUCKET || 'khaoniewback',
  WASABI_REGION: process.env.WASABI_REGION || 'ap-southeast-1',
  WASABI_ENDPOINT: process.env.WASABI_ENDPOINT || 'https://s3.ap-southeast-1.wasabisys.com',
  

  // R2
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || 'my-app-assets',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || '169b54a91abfda3c61e4c075120b509e',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || '8023b0046fa990615a16c3963fd5f426f589e22bd0c053cfc95d321aef006b9f',
  R2_ENDPOINT: process.env.R2_ENDPOINT || 'https://842807d1bb138a453468260785a1d032.r2.cloudflarestorage.com',
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || 'https://pub-4ae80b3183844cb28f38c9abe246797b.r2.dev',
};


