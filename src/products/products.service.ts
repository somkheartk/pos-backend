import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../entities/menu.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(category?: string): Promise<Product[]> {
    const filter = category ? { category } : {};
    return this.productModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByBarcode(barcode: string): Promise<Product> {
    const product = await this.productModel.findOne({ barcode }).exec();
    if (!product) {
      throw new NotFoundException(`Product with barcode ${barcode} not found`);
    }
    return product;
  }

  async search(query: string): Promise<Product[]> {
    return this.productModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { barcode: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    }).exec();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel({
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createdProduct.save();
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { ...updateProductDto, updatedAt: new Date() },
      { new: true }
    ).exec();
    
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract'): Promise<Product> {
    const product = await this.findOne(id);
    
    let newStock: number;
    if (operation === 'add') {
      newStock = product.stock + quantity;
    } else {
      newStock = Math.max(0, product.stock - quantity);
    }
    
    return this.update(id, { stock: newStock });
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category').exec();
    return categories.filter(category => category && category.trim() !== '');
  }

  async bulkUpdateStock(updates: Array<{ productId: string; quantity: number }>): Promise<void> {
    for (const update of updates) {
      await this.updateStock(update.productId, update.quantity, 'subtract');
    }
  }

  async createDefaultProducts(): Promise<void> {
    const count = await this.productModel.countDocuments();
    if (count > 0) {
      return; // มีข้อมูลแล้ว
    }

    const sampleProducts = [
      {
        name: 'กาแฟสดใส่นม',
        description: 'กาแฟสดชงใหม่ ใส่นมสดเข้มข้น',
        price: 45,
        category: 'เครื่องดื่ม',
        barcode: '001',
        stock: 50,
        tags: ['ร้อน', 'กาแฟ', 'นม']
      },
      {
        name: 'ชาเขียวน้ำผึ้ง',
        description: 'ชาเขียวแท้ผสมน้ำผึ้งธรรมชาติ',
        price: 35,
        category: 'เครื่องดื่ม',
        barcode: '002',
        stock: 30,
        tags: ['เย็น', 'ชา', 'น้ำผึ้ง']
      },
      {
        name: 'ขนมปังทาเนย',
        description: 'ขนมปังปิ้งสด ทาเนยเข้มข้น',
        price: 25,
        category: 'ขนม',
        barcode: '003',
        stock: 20,
        tags: ['ปิ้ง', 'เนย', 'ขนมปัง']
      },
      {
        name: 'ข้าวเหนียวมะม่วง',
        description: 'ข้าวเหนียวหวานเสิร์ฟพร้อมมะม่วงสุก',
        price: 80,
        category: 'ของหวาน',
        barcode: '004',
        stock: 15,
        tags: ['ข้าวเหนียว', 'มะม่วง', 'หวาน']
      },
      {
        name: 'น้ำส้มคั้น',
        description: 'น้ำส้มสดคั้นใหม่ รสชาติเปร้ยว',
        price: 40,
        category: 'เครื่องดื่ม',
        barcode: '005',
        stock: 25,
        tags: ['เย็น', 'ส้ม', 'วิตามินซี']
      },
      {
        name: 'แซนด์วิชไก่',
        description: 'แซนด์วิชไก่ย่างใส่ผัก',
        price: 65,
        category: 'อาหาร',
        barcode: '006',
        stock: 18,
        tags: ['ไก่', 'แซนด์วิช', 'ผัก']
      },
      {
        name: 'โดนัทช็อกโกแลต',
        description: 'โดนัทหอม อบใหม่ เคลือบช็อกโกแลต',
        price: 30,
        category: 'ขนม',
        barcode: '007',
        stock: 12,
        tags: ['โดนัท', 'ช็อกโกแลต', 'หวาน']
      },
      {
        name: 'กล้วยทอด',
        description: 'กล้วยน้ำว้าทอดกรอบ หวานหอม',
        price: 20,
        category: 'ขนม',
        barcode: '008',
        stock: 40,
        tags: ['ทอด', 'กล้วย', 'กรอบ']
      }
    ];

    await this.productModel.insertMany(sampleProducts);
    console.log('Default products created successfully');
  }
}
