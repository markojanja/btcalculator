import express from "express";
import {
  addFeature,
  editFeatueGet,
  editFeaturePut,
  featureDeatils,
  getFeatures,
} from "../controllers/features.controller.js";
import { requireStaff } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  createFeatureSchema,
  updateFeatureSchema,
} from "../validation/schemas.js";

const router = express.Router();

router.get("/features/all", getFeatures);
router.post(
  "/features/new",
  requireStaff,
  validate(createFeatureSchema),
  addFeature,
);
router.get("/features/:id", featureDeatils);
router
  .get("/features/:id/edit", requireStaff, editFeatueGet)
  .put(
    "/features/:id/edit",
    requireStaff,
    validate(updateFeatureSchema),
    editFeaturePut,
  );

export default router;
