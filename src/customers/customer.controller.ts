import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { CustomerService } from './customer.service';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Post()
  @Roles(['admin', 'manager', 'cashier'])
  async create(@Body() createCustomerDto: any) {
    return this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  @Roles(['admin', 'manager', 'cashier'])
  async update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  async remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
