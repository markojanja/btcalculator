import express from "express";
import passport from "passport";
import {
  login,
  logout,
  passwordChange,
  status,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/auth/status", status);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post(
  "/auth/passwordchange",
  passport.authenticate("session"),
  passwordChange
);

export default router;
