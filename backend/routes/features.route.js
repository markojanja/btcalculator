import express from "express";
import {
  addFeature,
  editFeatueGet,
  editFeaturePut,
  featureDeatils,
  getFeatures,
} from "../controllers/features.controller.js";

const router = express.Router();

router.get("/features/all", getFeatures);
router.post("/features/new", addFeature);
router.get("/features/:id", featureDeatils);
router
  .get("/features/:id/edit", editFeatueGet)
  .put("/features/:id/edit", editFeaturePut);

export default router;
