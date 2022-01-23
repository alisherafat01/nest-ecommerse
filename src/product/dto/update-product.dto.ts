import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsMongoId, ValidateNested } from 'class-validator';
import { ProductImage } from '../product-image.schema';
import { Product } from '../product.schema';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  images?: ProductImage[];
}
