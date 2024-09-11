import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cartItems: {
    quantity: number;
  };
  product: mongoose.Schema.Types.ObjectId;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
