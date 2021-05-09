import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private OrderModel: Model<Order>){}

  async findAll(){
    const Orders = await this.OrderModel.find().exec();
    return Orders;
  }

  async findOne(id: string){
    const order = await this.OrderModel.findById(id).exec();

    if (!order) {
      throw new NotFoundException(`order ${id} not found`);
    }

    return order;
  }

  async create(data: CreateOrderDto){
    const newModel = new this.OrderModel(data);
    return await newModel.save();
  }

  async update(id: string, changes: UpdateOrderDto){
    const order = await this.OrderModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true})
      .exec();

    if (!order) {
      throw new NotFoundException(`order ${id} not found`);
    }

    return order;
  }

  async delete(id: string){
    const order = await this.OrderModel.findByIdAndRemove(id).exec();
    
    if(!order){
      throw new NotFoundException(`order ${id} not found`);
    }

    return order;
  }
}
