import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
  @ApiHideProperty()
  @Exclude()
  @Transform(({ value }) => value.toString())
  @Type(() => Types.ObjectId)
  _id?: ObjectId;

  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  /*
   *title of product
   */
  @Expose()
  @IsString()
  @MinLength(10)
  @Prop({
    required: true,
    index: true,
  })
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  @Prop({
    required: true,
    type: [{ type: ProductImageSchema }],
    default: [],
  })
  images: ProductImage[];

  @ApiProperty({
    description: 'price of product',
  })
  @IsInt()
  @Min(0)
  @Prop({
    required: true,
  })
  price: number;

  @ApiProperty({
    description: 'count of avaialble products in stock',
  })
  @IsInt()
  @Min(0)
  @Prop({
    default: 0,
  })
  count: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
