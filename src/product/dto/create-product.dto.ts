import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEmpty,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ProductImage } from '../product-image.schema';
import { Product } from '../product.schema';

// export class CreateProductDto extends OmitType(Product, ['id'] as const) {
// @IsArray()
// @ValidateNested({ each: true })
// @Type(() => ProductImage)
// images: ProductImage[];
// }
export class CreateProductDto extends Product {}
