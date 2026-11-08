import { existsSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // .env dosyası varsa ortam değişkenlerini yükle (Node 20.12+ yerleşik özelliği)
  if (existsSync('.env')) {
    process.loadEnvFile('.env');
  }

  const app = await NestFactory.create(AppModule);

  // CORS: CORS_ORIGIN verilirse sadece o adreslere izin ver, yoksa herkese açık
  const origins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim());
  app.enableCors(origins?.length ? { origin: origins } : undefined);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap();
