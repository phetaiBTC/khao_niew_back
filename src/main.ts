import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { baseEnv } from './besa.env';
import * as dotenv from 'dotenv';
dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      errorHttpStatusCode: 422,
      disableErrorMessages: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(baseEnv.PORT);
}
bootstrap();
