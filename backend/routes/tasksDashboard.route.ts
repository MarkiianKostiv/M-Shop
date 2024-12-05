import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";
import {
  getAllDashBoardsByUserId,
  createDashboard,
  updateDashBoardById,
  getDashBoardById,
  deleteDashBoard,
} from "../controllers/taskDashboard.controller";

const router = express.Router();

router.get("/board/:id", protectedRoute, adminRoute, getDashBoardById);
router.get("/user", protectedRoute, adminRoute, getAllDashBoardsByUserId);
router.post("/", protectedRoute, adminRoute, createDashboard);
router.patch("/:id", protectedRoute, adminRoute, updateDashBoardById);
router.delete("/:id", protectedRoute, adminRoute, deleteDashBoard);

export default router;
