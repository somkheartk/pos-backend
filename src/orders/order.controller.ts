import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('stats')
  @Roles(['admin', 'manager', 'viewer'])
  async getStats() {
    return this.orderService.getStats();
  }

  @Get(':id')
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  @Roles(['admin', 'manager', 'cashier'])
  async create(@Body() createOrderDto: any) {
    return this.orderService.create(createOrderDto);
  }

  @Put(':id')
  @Roles(['admin', 'manager', 'cashier'])
  async update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
