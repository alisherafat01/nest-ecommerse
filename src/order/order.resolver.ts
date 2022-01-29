import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../authentication/gql-jwt.guard';
import { JwtAuthGuard } from '../authentication/jwt.guard';
import { CreateOrderInput } from './dto/create-order.dto';
import { Order } from './order.schema';
import { OrderService } from './order.service';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Mutation(() => Order)
  async createOrder(@Args('payload') payload: CreateOrderInput) {
    return this.orderService.create(payload);
  }

  @Query((returns) => [Order])
  async orders() {
    return this.orderService.findAll();
  }
  @Query((returns) => Order)
  async order(@Args('id', { type: () => Int }) id: string) {
    return this.orderService.findById(id);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation((returns) => Order)
  async deleteOrder(@Args('id', {}) id: string) {
    return this.orderService.delete(id);
  }
}
