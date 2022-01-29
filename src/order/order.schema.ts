import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import * as mongoose from 'mongoose';

import { Document, ObjectId, Types } from 'mongoose';
import { User, UserSchema } from '../users/user.schema';
import { OrderItem, OrderItemSchema } from './order-item.schema';

export type OrderDocument = Order & Document;

export enum PaymentStatus {
  Unknown = 'unknown',
  Pending = 'pending',
  Verify = 'verify',
  Cancell = 'cancell',
}

export enum Status {
  Place = 'placed',
  Cancell = 'cancell',
  Checkout = 'checkout',
}

registerEnumType(PaymentStatus, {
  name: 'OrderPaymentStatus',
});

registerEnumType(Status, {
  name: 'OrderStatus',
});

@ObjectType()
@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class Order {
  @ApiHideProperty()
  @Exclude()
  @Transform(({ value }) => value.toString())
  @Type(() => Types.ObjectId)
  _id?: ObjectId;

  @Field()
  id?: string;

  /*
   *title of product
   */
  @Field((type) => User)
  @Type(() => User)
  @Prop({
    required: true,
    index: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  owner: User | mongoose.Schema.Types.ObjectId;

  @Field((type) => [OrderItem])
  @Type(() => OrderItem)
  @Prop({
    required: true,
    type: [{ type: OrderItemSchema }],
    default: [],
  })
  items: OrderItem[];

  @Field((type) => Int)
  @Prop({
    required: true,
    default: 0,
    min: 0,
  })
  totalPrice: number;

  @Field((type) => PaymentStatus)
  @Prop({
    required: true,
    default: PaymentStatus.Unknown,
  })
  paymentStatus: PaymentStatus;

  @Field((type) => Status)
  @Prop({
    required: true,
    default: Status.Place,
  })
  status: Status;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
