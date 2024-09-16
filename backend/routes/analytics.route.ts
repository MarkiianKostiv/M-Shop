import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";
import { getData } from "../controllers/analytics.controller";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getData);

export default router;
