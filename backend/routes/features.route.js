import express from "express";
import { addFeature, getPublishedFeatures } from "../controllers/features.controller.js";

const router = express.Router();

router.get("/features/published", getPublishedFeatures);
router.post("/features/new", addFeature);

export default router;
