import express from "express";
import { getGuides } from "../controllers/guides.controller.js";

const router = express.Router();

router.get("/guides", getGuides);

export default router;
