import express from "express";
import {
  getAdminData,
  getAdminTasks,
  getAdminTask,
} from "../controllers/adminData.controller.js";
import { requireStaff } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { adminTasksParamsSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/admindata", requireStaff, getAdminData);

router.get(
  "/admindata/tasks/:type",
  requireStaff,
  validate(adminTasksParamsSchema, "params"),
  getAdminTasks,
);

router.get("/admindata/task/:id", requireStaff, getAdminTask);

export default router;
