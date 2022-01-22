import {
  IsDefined,
  IsEmail,
  IsEmpty,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Product } from '../product.schema';

export class CreateProductDto extends Product {
  @IsEmpty()
  id: string;

  @IsDefined()
  title: string;

  @IsDefined()
  price: number;
}
