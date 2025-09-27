import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop({ required: true, unique: true })
  code: string; // เช่น 'dashboard.view', 'orders.create'

  @Prop({ required: true })
  name: string; // ชื่อที่แสดง

  @Prop({ required: true })
  description: string; // คำอธิบาย

  @Prop({ required: true })
  module: string; // โมดูล เช่น 'dashboard', 'orders'

  @Prop({ required: true })
  action: string; // การกระทำ เช่น 'view', 'create', 'update', 'delete'

  @Prop({ default: true })
  isActive: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
