import { Field, InputType, Int } from '@nestjs/graphql';
import { IsMongoId, IsNumber, Min } from 'class-validator';

@InputType()
export class OrderItemInput {
  @Field((type) => Int)
  @IsNumber()
  @Min(1)
  amount: number;

  @Field()
  @IsMongoId()
  productId: string;
}
