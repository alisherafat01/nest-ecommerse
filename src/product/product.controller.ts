import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Product } from './product.schema';
import { Request } from 'express';
import { ProductService } from './product.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FlexibleValidationPipe } from '../shared/pipes/flexible-validation-pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import MongooseClassSerializerInterceptor from '../shared/interceptors/mongooseClassSerializer.interceptor';
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @UseInterceptors(MongooseClassSerializerInterceptor(Product))
  @Post('/')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return product;
  }

  @Get('/')
  @UseInterceptors(MongooseClassSerializerInterceptor(Product))
  async getProducts() {
    return await this.productService.getAll();
  }
}
