import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../models/user.model";

const schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      unique: false,
    },
    lastName: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6,
    },

    cartItems: {
      quantity: {
        type: Number,
        default: 1,
      },
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);
schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

schema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default model<IUser>("User", schema);
