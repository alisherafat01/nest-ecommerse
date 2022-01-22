import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Document, ObjectId, Types } from 'mongoose';

export type ProductImageDocument = ProductImage & Document;

@Schema({
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class ProductImage {
  @Exclude()
  @Transform(({ value }) => value.toString())
  @Type(() => Types.ObjectId)
  _id: ObjectId;

  @IsOptional()
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  @Prop({})
  title: string;

  @IsString()
  @Prop({
    required: true,
  })
  path: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);