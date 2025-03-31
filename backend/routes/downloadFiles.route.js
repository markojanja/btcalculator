import express from "express";
import { downloadFiles } from "../controllers/dowloadFiles.controller.js";

const router = express.Router();

router.get("/upload/:filename", downloadFiles);

export default router;
