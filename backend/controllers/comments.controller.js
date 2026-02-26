import prisma from "../db/prisma.js";
import { commentNotification } from "../services/notification.services.js";

export const getComments = async (req, res) => {
  try {
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
    res.status(500).json("Comments fethced!Server Error!");
  }
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  console.log(id, description, req.user.id);

  try {
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
    res.status(500).json("Comment not created!Server Error!");
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
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
    res.status(500).json("Comment not updated!Server Error!");
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.taskComments.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json("Comment deleted!");
  } catch (error) {
    res.status(500).json("Comment not deleted!Server Error!");
  }
};
