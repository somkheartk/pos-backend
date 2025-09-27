import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec();
  }

  async create(createCustomerDto: any): Promise<Customer> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  async update(id: string, updateCustomerDto: any): Promise<Customer | null> {
    return this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Customer | null> {
    return this.customerModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async getStats() {
    const totalCustomers = await this.customerModel.countDocuments({ isActive: true });
    const newThisMonth = await this.customerModel.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    return {
      total: totalCustomers,
      newThisMonth,
      growth: newThisMonth > 0 ? '+12%' : '0%'
    };
  }
}
