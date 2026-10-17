import express from "express";
import {
  activeClients,
  addClient,
  editClientGet,
  editClientPost,
  getClients,
} from "../controllers/clients.controller.js";
import { requireStaff } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { clientSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/clients/", getClients);
router.post("/clients/new", requireStaff, validate(clientSchema), addClient);
router
  .get("/clients/:id/edit", requireStaff, editClientGet)
  .put(
    "/clients/:id/edit",
    requireStaff,
    validate(clientSchema),
    editClientPost,
  );

router.get("/clients/active", activeClients);

export default router;
