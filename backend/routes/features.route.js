import express from "express";
import {
  addFeature,
  editFeatueGet,
  editFeaturePut,
  featureDeatils,
  getFeatures,
} from "../controllers/features.controller.js";
import { requireStaff } from "../middleware/authorize.js";

const router = express.Router();

router.get("/features/all", getFeatures);
router.post("/features/new", requireStaff, addFeature);
router.get("/features/:id", featureDeatils);
router
  .get("/features/:id/edit", requireStaff, editFeatueGet)
  .put("/features/:id/edit", requireStaff, editFeaturePut);

export default router;
