import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import cookieParser from 'cookie-parser';
import { UsersModule } from '../users/users.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ProductModule } from '../product/product.module';
import { getInMemoryMongoUri } from '../storage/mongodb/mongo-memory';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri:
          config.get('NODE_ENV') === 'test'
            ? await getInMemoryMongoUri()
            : config.get<string>('MONGO_CONNECTION'),
        //autoIndex: false,
      }),
    }),

    UsersModule,
    AuthenticationModule,
    ProductModule,
    OrderModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      debug: true,
      // context: ({ req }) => ({ req }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        //skipMissingProperties: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
