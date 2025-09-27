import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users'
})
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ 
    type: [String], 
    default: ['admin'],
    enum: ['admin', 'manager', 'cashier', 'viewer']
  })
  roles: string[];

  @Prop({ type: [String], default: [] })
  permissions: string[]; // เพิ่ม permissions array

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
