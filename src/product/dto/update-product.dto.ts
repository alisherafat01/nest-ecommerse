import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Product } from '../product.schema';

export class UpdateProductDto extends Product {
  @IsDefined()
  id: string;
}
