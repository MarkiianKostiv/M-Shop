import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import { connectDB } from "./lib/db";
dotenv.config();

const app = express();

const APP_PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRouter);

app.listen(APP_PORT, () => {
  connectDB();
  console.log(`Server started on port ${APP_PORT}`);
});
