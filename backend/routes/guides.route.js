import express from "express";
import { addGuide, getGuides } from "../controllers/guides.controller.js";

const router = express.Router();

router.get("/guides", getGuides);
router.post("/guides/new", addGuide);

export default router;
