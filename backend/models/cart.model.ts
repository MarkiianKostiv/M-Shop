import mongoose, { Document } from "mongoose";

export interface ICart extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  password: string;
  category: string;
  isFeatured: boolean;
}
