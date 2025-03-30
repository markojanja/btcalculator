import express from "express";
import { upload } from "../config/multer.config.js";
import { uploadFiles } from "../controllers/uploadFiles.controller.js";

const router = express.Router();

router.post("/", upload.fields([{ name: "jsonFile" }, { name: "xlsxFile" }]), uploadFiles);

export default router;
