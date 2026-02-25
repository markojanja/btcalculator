import prisma from "../db/prisma.js";
import {
  notifyTaskCreated,
  notifyTaskUpdate,
  notifyTaskUpdatedAdmin,
  notifyTaskUpdatedSupport,
} from "../services/notification.services.js";

export const myTasks = async (req, res) => {
  const user = req.user;
  // console.log("Fetching tasks...");
  const now = new Date();
  // Base endOfDay = today 23:00 local
  const endOfDay = new Date();
  endOfDay.setHours(23, 0, 0, 0);

  // Base startOfDay = yesterday 23:00 local
  const startOfDay = new Date(endOfDay);
  startOfDay.setDate(startOfDay.getDate() - 1);

  // ✅ If current time is after 23:00, shift the window forward
  if (now >= endOfDay) {
    startOfDay.setDate(startOfDay.getDate() + 1);
    endOfDay.setDate(endOfDay.getDate() + 1);
  }

  // Convert to UTC for Prisma
  const offsetMs = endOfDay.getTimezoneOffset() * 60 * 1000;
  const endUtc = new Date(endOfDay.getTime() - offsetMs);
  const startUtc = new Date(startOfDay.getTime() - offsetMs);

  const COLUMNS = [
    { title: "TODO", colStatus: "TODO" },
    { title: "IN PROGRESS", colStatus: "IN_PROGRESS" },
    { title: "CS TICKET", colStatus: "CS_TICKET" },
    { title: "IT TICKET", colStatus: "IT_TICKET" },
    { title: "COMPLETED", colStatus: "COMPLETED" },
  ];

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startUtc,
          lt: endUtc,
        },
      },

      include: {
        user: {
          select: {
            username: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
        taskComments: {
          select: {
            description: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    const data = COLUMNS.map((col) => ({
      ...col,
      tasks: tasks.filter((task) => task.status === col.colStatus),
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const addTask = async (req, res) => {
  try {
    const { title, client, description, priority, status } = req.body;

    console.log(req.body);

    const newTask = await prisma.tasks.create({
      data: {
        title,
        description,
        priority,
        status,
        userId: req.user.id,
        clientId: client,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    if (req.user.role === "SUPPORT") {
      notifyTaskCreated(newTask);
    }

    return res.status(200).json({ message: "Task created", task: newTask });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const editTask = async (req, res) => {
  const { id, title, description, status, priority, userId, client } = req.body;

  console.log("this is client ID ", client);

  try {
    const oldTask = await prisma.tasks.findUnique({
      where: { id },
      include: {
        user: {
          select: { username: true },
        },
      },
    });
    console.log(oldTask.user.username, "this is oldtask username");

    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(userId && { userId }),
      ...(client && { clientId: client }), // only set if exists
    };

    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: updatedFields,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (req.user.role === "ADMIN") {
      if (userId && userId !== oldTask.userId) {
        notifyTaskUpdate(oldTask, updatedTask, req.user);
      } else {
        notifyTaskUpdatedAdmin(updatedTask);
      }
    } else {
      notifyTaskUpdatedSupport(updatedTask, req.user);
    }

    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tasks.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "task deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getHandover = async (req, res) => {
  try {
    const now = new Date();

    // Base endOfDay = today 23:00 local
    const endOfDay = new Date();
    endOfDay.setHours(23, 0, 0, 0);

    // Base startOfDay = yesterday 23:00 local
    const startOfDay = new Date(endOfDay);
    startOfDay.setDate(startOfDay.getDate() - 1);

    // ✅ If current time is after 23:00, shift the window forward
    if (now >= endOfDay) {
      startOfDay.setDate(startOfDay.getDate() + 1);
      endOfDay.setDate(endOfDay.getDate() + 1);
    }

    // Convert to UTC for Prisma
    const offsetMs = endOfDay.getTimezoneOffset() * 60 * 1000;
    const endUtc = new Date(endOfDay.getTime() - offsetMs);
    const startUtc = new Date(startOfDay.getTime() - offsetMs);

    const handover = await prisma.tasks.findMany({
      where: {
        status: "CS_TICKET",
        createdAt: {
          gte: startUtc,
          lt: endUtc,
        },
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(handover);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
