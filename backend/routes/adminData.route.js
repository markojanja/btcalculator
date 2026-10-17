import express from "express";
import {
  getAdminData,
  getAdminTasks,
  getAdminTask,
} from "../controllers/adminData.controller.js";
import { requireStaff } from "../middleware/authorize.js";

const router = express.Router();

router.get("/admindata", requireStaff, getAdminData);

router.get("/admindata/tasks/:type", requireStaff, getAdminTasks);

router.get("/admindata/task/:id", requireStaff, getAdminTask);

export default router;
