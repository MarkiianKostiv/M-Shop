import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import couponRouter from "./routes/coupon.route";
import paymentRoute from "./routes/payment.route";
import analyticsRoute from "./routes/analytics.route";
import tasksDashBoardRoute from "./routes/tasksDashboard.route";

import { connectDB } from "./lib/db";

dotenv.config();

const app = express();
app.use(cors());

const APP_PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/coupons", couponRouter);
app.use("/payment", paymentRoute);
app.use("/analytics", analyticsRoute);
app.use("/tasks-dashboard", tasksDashBoardRoute);

app.listen(APP_PORT, () => {
  connectDB();
  console.log(`Server started on port ${APP_PORT}`);
});
