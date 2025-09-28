import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Menu extends Document {
  @Prop({ required: true })
  name: string; // ชื่อเมนู เช่น 'แดชบอร์ด'

  @Prop({ required: true, unique: true })
  key: string; // key เช่น 'dashboard'

  @Prop({ required: true })
  path: string; // path เช่น '/'

  @Prop({ required: true })
  icon: string; // ชื่อ icon เช่น 'DashboardIcon'

  @Prop()
  description: string; // คำอธิบาย

  @Prop({ default: 0 })
  order: number; // ลำดับการแสดง

  @Prop([String])
  requiredPermissions: string[]; // permissions ที่ต้องมี

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  parentId: string; // สำหรับ submenu (ถ้ามี)
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop()
  barcode: string;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop()
  image: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;
