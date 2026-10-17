import prisma from "../db/prisma.js";
import { commentNotification } from "../services/notification.services.js";
import { isStaff } from "../middleware/authorize.js";

// Only the task owner and staff can read or post comments on a task.
const canAccessTask = async (taskId, user) => {
  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: { userId: true },
  });
  if (!task) return { status: 404, message: "Task not found." };
  if (task.userId !== user.id && !isStaff(user)) {
    return { status: 403, message: "Forbidden." };
  }
  return null;
};

const findComment = (id) =>
  prisma.taskComments.findUnique({
    where: { id },
    select: { userId: true },
  });

export const getComments = async (req, res, next) => {
  try {
    const denied = await canAccessTask(req.params.id, req.user);
    if (denied) {
      return res.status(denied.status).json({ message: denied.message });
    }

    const comments = await prisma.taskComments.findMany({
      where: {
        taskId: req.params.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const denied = await canAccessTask(id, req.user);
    if (denied) {
      return res.status(denied.status).json({ message: denied.message });
    }

    const comment = await prisma.taskComments.create({
      data: {
        taskId: id,
        userId: req.user.id,
        description: description,
      },
    });
    commentNotification(comment, id, req.user).catch((error) =>
      console.error("Failed to send comment notification:", error),
    );
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const existing = await findComment(id);
    if (!existing) {
      return res.status(404).json({ message: "Comment not found." });
    }
    if (existing.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own comments." });
    }

    const comment = await prisma.taskComments.update({
      where: {
        id: id,
      },
      data: {
        description: description,
      },
    });
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existing = await findComment(id);
    if (!existing) {
      return res.status(404).json({ message: "Comment not found." });
    }
    if (existing.userId !== req.user.id && !isStaff(req.user)) {
      return res.status(403).json({ message: "Forbidden." });
    }

    await prisma.taskComments.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json("Comment deleted!");
  } catch (error) {
    next(error);
  }
};
