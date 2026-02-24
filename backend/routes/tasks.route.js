import express from "express";
import {
  addTask,
  deleteTask,
  editTask,
  myTasks,
  getHandover,
} from "../controllers/tasks.controller.js";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.get("/tasks/my_tasks", myTasks);
router.post("/tasks/add_task", addTask);
router.put("/tasks/edit_task", editTask);
router.put("/tasks/delete_task/:id", deleteTask);
router.get("/tasks/handover", getHandover);
router.put("/tasks/comments/:id", updateComment);
router.delete("/tasks/comments/:id", deleteComment);
router.get("/tasks/:id/comments/all", getComments);
router.post("/tasks/:id/comments/new", addComment);

export default router;
