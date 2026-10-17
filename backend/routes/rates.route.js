import express from "express";
import { getRate } from "../controllers/rates.controller.js";

const router = express.Router();

router.get("/rates", getRate);

export default router;
