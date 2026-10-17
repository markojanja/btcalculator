import express from "express";
import passport from "passport";
import { isAuth } from "../middleware/isAuth.js";
import {
  login,
  logout,
  passwordChange,
  status,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { passwordChangeSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/auth/status", status);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post(
  "/auth/passwordchange",
  passport.authenticate("session"),
  isAuth,
  validate(passwordChangeSchema),
  passwordChange,
);

export default router;
