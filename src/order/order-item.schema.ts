import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Product } from '../product/product.schema';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export type OrderItemDocument = OrderItem & Document;

@ObjectType()
@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class OrderItem {
  @ApiHideProperty()
  @Exclude()
  @Transform(({ value }) => value.toString())
  @Type(() => Types.ObjectId)
  _id?: ObjectId;

  @Field()
  @Expose()
  id?: string;

  @Field()
  @Prop({
    required: true,
  })
  product_title: string;

  @Field((type) => Int)
  @Prop({
    required: true,
  })
  product_price: number;

  @Field((type) => Int)
  @Prop({
    required: true,
  })
  amount: number;

  @Field((type) => Product)
  @Type(() => Product)
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
  })
  product: Product;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
