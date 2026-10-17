import express from "express";
import {
  activeClients,
  addClient,
  editClientGet,
  editClientPost,
  getClients,
} from "../controllers/clients.controller.js";
import { requireStaff } from "../middleware/authorize.js";

const router = express.Router();

router.get("/clients/", getClients);
router.post("/clients/new", requireStaff, addClient);
router
  .get("/clients/:id/edit", requireStaff, editClientGet)
  .put("/clients/:id/edit", requireStaff, editClientPost);

router.get("/clients/active", activeClients);

export default router;
