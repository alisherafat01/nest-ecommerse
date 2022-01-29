import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 3000;

  if (configService.get('NODE_ENV') === 'production') app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('E-Commerse API')
    .setDescription('Use this api in your client')
    .setVersion('1.0')
    .addTag('e-commerce')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(PORT);
  console.log('app is running on ' + (await app.getUrl()));
}
bootstrap();
