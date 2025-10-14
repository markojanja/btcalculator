import { formatPriortiy, formatStatuses } from "../utils/adminDataUtils.js";
import {
  getTasksByStatus,
  getTasksByPriority,
  getTasksByUser,
  getLatestTasks,
  getRecentUsers,
  getTasksStatusAndPriority,
} from "../services/adminData.service.js";
import prisma from "../db/prisma.js";

export const getAdminData = async (req, res) => {
  try {
    const rawStatus = await getTasksByStatus();
    const rawPriority = await getTasksByPriority();
    const rawByUser = await getTasksByUser();

    const tasksByStatus = formatStatuses(rawStatus);
    const tasksByPriority = formatPriortiy(rawPriority);

    const latestTasks = await getLatestTasks();
    const recentUsers = await getRecentUsers();

    return res.status(200).json({
      tasksByStatus,
      tasksByPriority,
      rawByUser,
      latestTasks,
      recentUsers,
    });
  } catch (error) {
    console.log("error /admindata", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

export const getAdminTasks = async (req, res) => {
  const { type } = req.params;

  let filter = {};
  let excludeCompleted = true;

  if (type === "pending") {
    filter.status = { in: ["TODO", "IN_PROGRESS"] };
  } else if (type === "JIRA_TICKET") {
    filter.status = { in: ["CS_TICKET", "IT_TICKET"] };
  } else if (type === "priority") {
    filter.priority = { in: ["HIGH", "MEDIUM", "LOW"] };
  } else if (type === "COMPLETED") {
    filter.status = type;
    excludeCompleted = false;
  } else if (type === "ALL") {
    filter = {};
    excludeCompleted = false;
  } else {
    filter.status = type;
  }

  try {
    const tasks = await getTasksStatusAndPriority(filter, excludeCompleted);

    return res.status(200).json({ page_title: type, tasks });
  } catch (error) {
    console.log(error);
  }
};

export const getAdminTask = async (req, res) => {
  const { id } = req.params;
  // console.log(req.params);
  try {
    const task = await prisma.tasks.findUnique({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};
