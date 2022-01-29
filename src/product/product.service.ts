import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }
  async create(createDto: CreateProductDto) {
    const newProduct = new this.productModel(createDto);
    return newProduct.save();
  }

  async update(id: string, productData: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      { _id: id },
      productData,
      { new: true },
    );
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  async getAll() {
    return this.productModel.find();
  }

  async delete(id: string) {
    const model = await this.productModel.findById(id);
    if (!model) {
      throw new NotFoundException();
    }
    return model.delete();
  }

  async deleteAll() {
    return this.productModel.deleteMany();
  }
}
