import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandsService {

  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>){}

  async findAll() {
    return await this.brandModel.find().exec();
  }

  async findOne(id: number) {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  async create(data: CreateBrandDto) {
    const newBrand = new this.brandModel(data);
    return await newBrand.save();
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.brandModel
      .findByIdAndUpdate(id, { $set: changes}, { new: true} )
      .exec();

    if (!brand) {
      throw new NotFoundException(`Brand ${id} not found`);
    }

    return brand;
  }

  async remove(id: number) {
    const deleteBrand = await this.brandModel.findByIdAndDelete(id);
    
    if (!deleteBrand) {
      throw new NotFoundException(`Brand ${id} not found`);
    }

    return deleteBrand;
  }
}
