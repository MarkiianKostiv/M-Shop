import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  password: string;
  category: string;
  isFeatured: boolean;
}
