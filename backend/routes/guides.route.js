import express from "express";
import {
  addGuide,
  editGuideGet,
  editGuidePut,
  getGuide,
  getGuides,
} from "../controllers/guides.controller.js";

const router = express.Router();

router.get("/guides", getGuides);
router.post("/guides/new", addGuide);
router.get("/guides/:id", getGuide);
router
  .get("/guides/:id/edit", editGuideGet)
  .put("/guides/:id/edit", editGuidePut);

export default router;
