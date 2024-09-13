import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { ICart } from "../models/cart.model";

const schema = new Schema<ICart>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: String,
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ICart>("Cart", schema);
