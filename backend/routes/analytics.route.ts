import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  addToCart,
  deleteAllFromCart,
  updateQuantity,
  getCartProducts,
} from "../controllers/cart.controller";

const router = express.Router();

router.post("/", protectedRoute, addToCart);
router.get("/", protectedRoute, getCartProducts);
router.delete("/delete", protectedRoute, deleteAllFromCart);
router.put("/add/:id", protectedRoute, updateQuantity);

export default router;
