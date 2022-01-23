import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt.guard';
import ParamsMongoId from '../shared/utils/params-with-mongo-id';
@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}
  /**
   * Create some resource
   */

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @UseInterceptors(MongooseClassSerializerInterceptor(Product))
  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiBearerAuth()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return product;
  }

  @ApiParam({ name: 'id' })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @UseInterceptors(MongooseClassSerializerInterceptor(Product))
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Patch(':id')
  async updateProduct(
    @Param() { id }: ParamsMongoId,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    return product;
  }

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(MongooseClassSerializerInterceptor(Product))
  @ApiBearerAuth()
  @Get('/')
  async getProducts() {
    return await this.productService.getAll();
  }
}
