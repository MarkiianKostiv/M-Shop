import mongoose, { Document } from "mongoose";

export interface ICoupon extends Document {
  _id: string;
  code: string;
  disCountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userId: typeof mongoose.Schema.ObjectId;
}
