import express from "express";
import { downloadFiles } from "../controllers/dowloadFiles.controller.js";

const router = express.Router();

router.get("/downloads/:filename", downloadFiles);

export default router;
