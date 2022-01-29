import { Field, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
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

  @Field()
  @IsOptional()
  @IsString()
  @Expose()
  id?: string;

  /*
   *title of product
   */
  @Field()
  @Expose()
  @IsString()
  @MinLength(10)
  @Prop({
    required: true,
    index: true,
  })
  title: string;

  @Field((type) => ProductImage)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  @Prop({
    required: true,
    type: [{ type: ProductImageSchema }],
    default: [],
  })
  images: ProductImage[];

  @Field((type) => Int)
  @IsInt()
  @Min(0)
  @Prop({
    required: true,
  })
  price: number;

  @Field((type) => Int)
  @IsInt()
  @Min(0)
  @Prop({
    default: 0,
  })
  count: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
