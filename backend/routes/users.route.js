import express from "express";
import { addUser, getUsers } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/users/all", getUsers);
router.post("/users/new", addUser);

export default router;
