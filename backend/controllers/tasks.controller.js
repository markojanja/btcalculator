import prisma from "../db/prisma.js";
import {
  notifyTaskCreated,
  notifyTaskUpdate,
  notifyTaskUpdatedAdmin,
  notifyTaskUpdatedSupport,
} from "../services/notification.services.js";
import { getShiftDayRange } from "../utils/helpers.js";

export const myTasks = async (req, res, next) => {
  const user = req.user;

  const { startOfDay, endOfDay } = getShiftDayRange();

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
          gte: startOfDay,
          lt: endOfDay,
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
    next(error);
  }
};

export const addTask = async (req, res, next) => {
  try {
    const { title, client, description, priority, status } = req.body;

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
    next(error);
  }
};

export const editTask = async (req, res, next) => {
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
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.tasks.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "task deleted" });
  } catch (error) {
    next(error);
  }
};

export const getHandover = async (req, res, next) => {
  try {
    const { startOfDay, endOfDay } = getShiftDayRange();

    const handover = await prisma.tasks.findMany({
      where: {
        status: "CS_TICKET",
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
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
    next(error);
  }
};
