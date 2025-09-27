import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({
  timestamps: true,
  collection: 'customers'
})
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({ default: 'regular', enum: ['regular', 'vip', 'premium'] })
  membershipType: string;

  @Prop({ type: Number, default: 0 })
  totalSpent: number;

  @Prop({ type: Number, default: 0 })
  totalOrders: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
