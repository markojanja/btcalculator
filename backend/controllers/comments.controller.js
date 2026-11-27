import prisma from "../db/prisma.js";
import { commentNotification } from "../services/notification.services.js";
import { canAccess } from "../utils/helpers.js";

export const getComments = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await prisma.tasks.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (task === null) {
      return res.status(404).json({ message: "Task no longer exists." });
    }
    if (!canAccess(req.user, task.userId)) {
      return res
        .status(403)
        .json({ message: "You do not have enough permissions." });
    }

    const comments = await prisma.taskComments.findMany({
      where: {
        taskId: id,
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
    const task = await prisma.tasks.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (task === null) {
      return res.status(404).json({ message: "Task no longer exists." });
    }
    if (!canAccess(req.user, task.userId)) {
      return res
        .status(403)
        .json({ message: "You do not have enough permissions." });
    }

    const comment = await prisma.taskComments.create({
      data: {
        taskId: id,
        userId: req.user.id,
        description: description,
      },
    });
    commentNotification(comment, id, req.user);
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const originalComment = await prisma.taskComments.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (originalComment === null) {
      return res.status(404).json({ message: "Comment no longer exists." });
    }
    if (originalComment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You do not have enough permissions." });
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
    const comment = await prisma.taskComments.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (comment === null) {
      return res.status(404).json({ message: "Task no longer exists." });
    }
    if (!canAccess(req.user, comment.userId)) {
      return res
        .status(403)
        .json({ message: "You do not have enough permissions." });
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
