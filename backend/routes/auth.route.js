import express from "express";
import { login, logout, status } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/auth/status", status);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

export default router;
