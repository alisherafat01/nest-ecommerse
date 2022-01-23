import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEmpty,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
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
// export class CreateProductDto extends Product {}
export class CreateProductDto {
  @IsString()
  @MinLength(10)
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  images: ProductImage[];

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  count: number;
}
