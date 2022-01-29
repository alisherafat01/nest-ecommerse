import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderInput } from './dto/create-order.dto';
import { Order, OrderDocument, PaymentStatus, Status } from './order.schema';
import * as mongoose from 'mongoose';
import { UsersService } from '../users/users.service';
import { OrderItem } from './order-item.schema';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private userService: UsersService,
    private productService: ProductService,
  ) {}

  async create(payload: CreateOrderInput) {
    const newOrder = new this.orderModel();
    const owner = await this.userService.findById(payload.ownerId);
    newOrder.owner = owner;
    newOrder.totalPrice = 0;
    for (let item of payload.items) {
      let product = await this.productService.findById(item.productId);
      let orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.amount = item.amount;
      orderItem.product_price = product.price;
      orderItem.product_title = product.title;
      newOrder.totalPrice += orderItem.amount * orderItem.product_price;
      newOrder.items.push(orderItem);
    }
    newOrder.status = Status.Place;
    newOrder.paymentStatus = PaymentStatus.Unknown;

    return newOrder.save();
  }

  async findAll() {
    return (
      this.orderModel
        .find()
        .populate('owner')
        // .populate('items.product')
        .exec()
    );
  }
  async findById(id: string) {
    return this.orderModel.findById(id);
  }

  async delete(id: string) {
    const product = await this.orderModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
