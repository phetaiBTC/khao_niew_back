// seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';

import { SeederService } from './seeder.service';

async function bootstrap() {
  // สร้าง application context
  const app = await NestFactory.createApplicationContext(AppModule);

  // ดึง SeederService
  const seeder = app.get(SeederService);

  // รัน seed
  await seeder.seed();

  console.log('Seeding finished!');

  // ปิด context
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeding failed!', err);
});
