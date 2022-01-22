import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Document, ObjectId, Types } from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    getters: true,
  },
})
@Expose()
export class User {
  @Exclude()
  @Transform(({ value }) => value.toString())
  @Type(() => Types.ObjectId)
  // @Prop({
  //type: Types.ObjectId,
  // })
  _id: ObjectId;

  @Expose()
  id: string;

  @Expose()
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  email: string;

  @Exclude({})
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
