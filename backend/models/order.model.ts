import mongoose, { Document } from "mongoose";

export interface IStripeProduct {
  id: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: Array<IStripeProduct>;
  totalAmount: number;
  stripeSessionId: string;
}
