import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.use(helmet());
  app.enableCors();
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('E-Commerse API')
    .setDescription('Use this api in your client')
    .setVersion('1.0')
    .addTag('e-commerce')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/api', app, document);

  await app.listen(PORT);
}
bootstrap();
