import express from "express";
import { staffOnly } from "../middleware/requireRole.js";
import {
  activeClients,
  addClient,
  editClientGet,
  editClientPost,
  getClients,
} from "../controllers/clients.controller.js";

const router = express.Router();

router.get("/clients/", getClients);
router.post("/clients/new", staffOnly, addClient);
router
  .get("/clients/:id/edit", staffOnly, editClientGet)
  .put("/clients/:id/edit", staffOnly, editClientPost);

router.get("/clients/active", activeClients);

export default router;
