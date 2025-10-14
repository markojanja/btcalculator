import express from "express";
import {
  getAdminData,
  getAdminTasks,
  getAdminTask,
} from "../controllers/adminData.controller.js";

const router = express.Router();

router.get("/admindata", getAdminData);

router.get("/admindata/tasks/:type", getAdminTasks);

router.get("/admindata/task/:id", getAdminTask);

export default router;
