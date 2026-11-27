import express from "express";
import { downloadFiles } from "../controllers/dowloadFiles.controller.js";

const router = express.Router();

router.get("/downloads/:id", downloadFiles);

export default router;
