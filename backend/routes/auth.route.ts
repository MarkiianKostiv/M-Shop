import express from "express";
import {
  getUserData,
  login,
  logout,
  refreshToken,
  signUp,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/profile", getUserData);

export default router;
