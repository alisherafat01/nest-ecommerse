import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { OrderItem } from '../order-item.schema';
import { PaymentStatus, Status } from '../order.schema';
import { OrderItemInput } from './order-item.input';

@InputType()
export class CreateOrderInput {
  @Field()
  @IsMongoId()
  ownerId: string;

  @Type(() => OrderItemInput)
  @Field((type) => [OrderItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  items: OrderItemInput[];
}
