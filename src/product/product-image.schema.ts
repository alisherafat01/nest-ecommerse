import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Document, ObjectId, Types } from 'mongoose';

export type ProductImageDocument = ProductImage & Document;

@ObjectType()
@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class ProductImage {
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
   *title of image
   */
  @Field()
  @IsOptional()
  @IsString()
  @Expose()
  @Prop({})
  title?: string;

  @Field()
  @IsString()
  @Prop({
    required: true,
  })
  path: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
