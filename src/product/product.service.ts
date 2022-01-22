import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(productDto: CreateProductDto) {
    const newProduct = new this.productModel(productDto);
    return newProduct.save();
  }

  async getAll(){
    return this.productModel.find();
  }
}
