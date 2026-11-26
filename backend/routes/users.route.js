import express from "express";
import { staffOnly } from "../middleware/requireRole.js";
import {
  addUser,
  editUserGet,
  editUserPut,
  getUsers,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/users/all", staffOnly, getUsers);
router.post("/users/new", staffOnly, addUser);
router
  .get("/users/:id/edit", staffOnly, editUserGet)
  .put("/users/:id/edit", staffOnly, editUserPut);

export default router;
