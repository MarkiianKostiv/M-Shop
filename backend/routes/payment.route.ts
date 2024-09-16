import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { createCheckoutSession } from "../controllers/payment.controller";

const router = express.Router();

router.post("/create-checkout-session", protectedRoute, createCheckoutSession);

export default router;
