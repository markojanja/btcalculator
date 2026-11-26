import express from "express";
import { staffOnly } from "../middleware/requireRole.js";
import {
  getAdminData,
  getAdminTasks,
  getAdminTask,
} from "../controllers/adminData.controller.js";

const router = express.Router();

router.get("/admindata", staffOnly, getAdminData);

router.get("/admindata/tasks/:type", staffOnly, getAdminTasks);

router.get("/admindata/task/:id", staffOnly, getAdminTask);

export default router;
