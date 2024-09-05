import express from "express";
import { login, logout, signUp } from "../controllers/auth.controller";
const router = express.Router();

router.post("/sign-up", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
