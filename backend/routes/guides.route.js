import express from "express";
import {
  addGuide,
  editGuideGet,
  editGuidePut,
  getGuide,
  getGuides,
} from "../controllers/guides.controller.js";
import { validate } from "../middleware/validate.js";
import { guideSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/guides", getGuides);
router.post("/guides/new", validate(guideSchema), addGuide);
router.get("/guides/:id", getGuide);
router
  .get("/guides/:id/edit", editGuideGet)
  .put("/guides/:id/edit", validate(guideSchema), editGuidePut);

export default router;
