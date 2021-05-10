import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AddProductsToOrderDto, CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService){}

  @Get('')
  findAll(){
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateOrderDto){
    return this.ordersService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateOrderDto){
    return this.ordersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }

  @Put(':id/products')
  addProduct(
    @Param('id') id: string,
    @Body() payload: AddProductsToOrderDto
  ){
    return this.ordersService.addProducts(id, payload.productsIds);
  }

  @Delete(':id/product/:productId')
  removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string
  ){
    return this.ordersService.deleteProduct(id, productId);
  }
}
