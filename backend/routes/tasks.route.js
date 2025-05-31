import express from "express";
import { addTask, deleteTask, editTask, myTasks } from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/tasks/my_tasks", myTasks);
router.post("/tasks/add_task", addTask);
router.put("/tasks/edit_task", editTask);
router.put("/tasks/delete_task/:id", deleteTask);

export default router;
