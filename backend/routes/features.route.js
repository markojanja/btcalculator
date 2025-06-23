import express from "express";
import {
  addFeature,
  featureDeatils,
  getPublishedFeatures,
} from "../controllers/features.controller.js";

const router = express.Router();

router.get("/features/published", getPublishedFeatures);
router.post("/features/new", addFeature);
router.get("/features/:id", featureDeatils);

export default router;
