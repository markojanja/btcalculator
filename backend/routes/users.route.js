import express from "express";
import {
  addUser,
  editUserGet,
  editUserPut,
  getUsers,
} from "../controllers/users.controller.js";
import { requireStaff } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, updateUserSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/users/all", requireStaff, getUsers);
router.post("/users/new", requireStaff, validate(createUserSchema), addUser);
router
  .get("/users/:id/edit", requireStaff, editUserGet)
  .put(
    "/users/:id/edit",
    requireStaff,
    validate(updateUserSchema),
    editUserPut,
  );

export default router;
