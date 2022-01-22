import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.use(helmet());
  app.enableCors();
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 3000;
  await app.listen(PORT);
}
bootstrap();
