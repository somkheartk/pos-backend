import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'roles' })
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string; // เช่น 'admin', 'manager', 'cashier'

  @Prop({ required: true })
  displayName: string; // เช่น 'แอดมิน', 'ผู้จัดการ', 'แคชเชียร์'

  @Prop()
  description: string; // คำอธิบายบทบาท

  @Prop({ type: [String], default: [] })
  permissions: string[]; // array ของ permission codes

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  level: number; // ระดับสิทธิ์ (admin = 0, manager = 1, cashier = 2)
}

export const RoleSchema = SchemaFactory.createForClass(Role);
