import express from "express";
import { formatPriortiy, formatStatuses } from "../utils/adminDataUtils.js";
import {
  getTasksByStatus,
  getTasksByPriority,
  getTasksByUser,
} from "../services/adminDataService.js";

const router = express.Router();

router.get("/admindata", async (req, res) => {
  try {
    const rawStatus = await getTasksByStatus();
    const rawPriority = await getTasksByPriority();
    const rawByUser = await getTasksByUser();

    const tasksByStatus = formatStatuses(rawStatus);
    const tasksByPriority = formatPriortiy(rawPriority);

    return res.status(200).json({ tasksByStatus, tasksByPriority, rawByUser });
  } catch (error) {
    console.log("error /admindata", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
});

export default router;
