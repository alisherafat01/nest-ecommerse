import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ProductModule } from '../product/product.module';
import { UsersModule } from '../users/users.module';
import { OrderResolver } from './order.resolver';
import { Order, OrderSchema } from './order.schema';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UsersModule,
    ProductModule,
  ],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
