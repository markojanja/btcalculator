import express from "express";
import {
  addUser,
  editUserGet,
  editUserPut,
  getUsers,
} from "../controllers/users.controller.js";
import { requireStaff } from "../middleware/authorize.js";

const router = express.Router();

router.get("/users/all", requireStaff, getUsers);
router.post("/users/new", requireStaff, addUser);
router
  .get("/users/:id/edit", requireStaff, editUserGet)
  .put("/users/:id/edit", requireStaff, editUserPut);

export default router;
