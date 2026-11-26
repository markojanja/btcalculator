import express from "express";
import { staffOnly } from "../middleware/requireRole.js";
import {
  addFeature,
  editFeatueGet,
  editFeaturePut,
  featureDeatils,
  getFeatures,
} from "../controllers/features.controller.js";

const router = express.Router();

router.get("/features/all", getFeatures);
router.post("/features/new", staffOnly, addFeature);
router.get("/features/:id", featureDeatils);
router
  .get("/features/:id/edit", staffOnly, editFeatueGet)
  .put("/features/:id/edit", staffOnly, editFeaturePut);

export default router;
