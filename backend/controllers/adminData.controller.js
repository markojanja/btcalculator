import { formatPriortiy, formatStatuses } from "../utils/adminDataUtils.js";
import {
  getTasksByStatus,
  getTasksByPriority,
  getTasksByUser,
  getLatestTasks,
  getRecentUsers,
} from "../services/adminData.service.js";

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
  } else {
    filter.status = type;
  }
  console.log(filter);
  try {
    const tasks = await getTasksStatusAndPriority(filter, excludeCompleted);

    return res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
  }
};
