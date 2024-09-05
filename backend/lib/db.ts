import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(`${MONGO_URI}`);
  } catch (error) {
    console.error("Error MongoDB connection");
  }
};
