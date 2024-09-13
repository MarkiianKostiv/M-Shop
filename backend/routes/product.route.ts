import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getFeaturedProducts);
router.get("/category/:name", getProductsByCategory);
router.post("/add", protectedRoute, adminRoute, createProduct);
router.post("/delete/:id", protectedRoute, adminRoute, deleteProduct);
router.patch("/update/:id", protectedRoute, adminRoute, toggleFeaturedProduct);

export default router;
