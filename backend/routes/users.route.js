import express from "express";
import { addUser, editUserGet, editUserPut, getUsers } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/users/all", getUsers);
router.post("/users/new", addUser);
router.get("/users/:id/edit", editUserGet).put("/users/:id/edit", editUserPut);

export default router;
