import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from './../../products/services/products.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {


  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}


  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`user #${id} not found`);
    }

    return user;
  }

  async create(data: CreateUserDto) {
    const newModel = new this.userModel(data);
    return await newModel.save();
  }
  async getOrdersByUser(userId: string) {
    const user = await this.findOne(userId);
    return {
      date: new Date(),
      user,
      // products: this.productsService.findAll(),
      products: [],
    };
  }

  update(id: string, changes: UpdateUserDto) {
    const user = this.userModel
      .findByIdAndUpdate(id, { $set: changes}, { new: true })
      .exec();

    if (!user) {
     throw new NotFoundException(`user #${id} not found`);
    }

    return user;
  }

  async remove(id: string) {
    const deleteUser = await this.userModel.findByIdAndRemove(id).exec();
    if (!deleteUser) {
      throw new NotFoundException(`user ${id} not found`);
    }

    return deleteUser;
  }

  
}
