import { Injectable, NotFoundException } from '@nestjs/common';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from './../dtos/products.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(params?: FilterProductsDto) {
    if (params) {
      const filters: FilterQuery<Product> = {};

      const { limit, offset } = params;
      const { minPrice, maxPrice } = params;

      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }

      return await this.productModel
        .find(filters)
        .skip(offset)
        .limit(limit)
        .populate('brand')
        .exec();
    }
    return await this.productModel.find().populate('brand').exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    return await newProduct.save();
  }

  async update(id: string, changes: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndRemove(id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }
}
