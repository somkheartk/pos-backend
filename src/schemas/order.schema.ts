import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
  collection: 'orders'
})
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  tax: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ required: true, type: Number })
  total: number;

  @Prop({ default: 'pending', enum: ['pending', 'completed', 'cancelled'] })
  status: string;

  @Prop({ default: 'cash', enum: ['cash', 'card', 'transfer'] })
  paymentMethod: string;

  @Prop([{
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }])
  items: {
    productId: Types.ObjectId;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
