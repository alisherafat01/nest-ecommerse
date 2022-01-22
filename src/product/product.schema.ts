import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  Contains,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Document, ObjectId, Types } from 'mongoose';
import { ProductImage, ProductImageSchema } from './product-image.schema';

export type ProductDocument = Product & Document;

@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class Product {
  @Exclude()
  @Transform(({ value }) => value.toString())
  @Type(() => Types.ObjectId)
  _id: ObjectId;

  @IsString()
  @Expose()
  id: string;

  @Expose()
  @IsString()
  @MinLength(10)
  @Prop({
    required: true,
    index: true,
  })
  title: string;

  @IsArray({ always: true })
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  @Prop({
    required: true,
    type: [{ type: ProductImageSchema }],
    default: [],
  })
  images: ProductImage[];

  @IsInt()
  @Min(0)
  @Prop({
    required: true,
  })
  price: number;

  @IsInt()
  @Min(0)
  @Prop({
    default: 0,
  })
  count: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
