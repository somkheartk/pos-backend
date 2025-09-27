import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'menus' })
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

  @Prop({ type: [String], default: [] })
  requiredPermissions: string[]; // permissions ที่ต้องมี

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  parentId: string; // สำหรับ submenu (ถ้ามี)
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
