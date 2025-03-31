import express from "express";
import { downloadFiles } from "../controllers/dowloadFiles.controller.js";

const router = express.Router();

router.get("/:filename", downloadFiles);

export default router;
