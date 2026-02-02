import express from "express";
import {
  addClient,
  editClientGet,
  editClientPost,
  getClients,
} from "../controllers/clients.controller.js";

const router = express.Router();

router.get("/clients/", getClients);
router.post("/clients/new", addClient);
router
  .get("/clients/:id/edit", editClientGet)
  .put("/clients/:id/edit", editClientPost);

export default router;
