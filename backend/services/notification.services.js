import { io } from "../server.js";
import prisma from "../db/prisma.js";

export const notifyTaskCreated = (task) => {
  if (!io) {
    console.warn("Socket.io not initialized yet");
    return;
  }

  try {
    io.to("role:ADMIN")
      .to("role:MANAGER")
      .emit("notification", {
        message: `New task created: ${task.title}`,
        taskId: task.id,
      });
    console.log("Notification emitted for task:", task.id);
  } catch (err) {
    console.error("Failed to emit notification:", err);
  }
};

export const notifyTaskUpdatedAdmin = (task) => {
  if (!io) {
    console.warn("Socket.io not initialized yet");
    return;
  }

  try {
    io.to(`user:${task.userId}`).emit("notification", {
      type: "TASK_UPDATED",
      message: `Your task has been updated by Admin: ${task.title}`,
      taskId: task.id,
    });
    console.log("Notification emitted for task:", task.id);
  } catch (err) {
    console.error("Failed to emit notification:", err);
  }
};

export const notifyTaskUpdate = (oldTask, newTask, actor) => {
  if (!io) return;

  try {
    if (oldTask) {
      io.to(`user:${oldTask.userId}`).emit("notification", {
        type: "TASK_UPDATED",
        message: `Task "${newTask.title}" has been reassigned`,
        taskId: newTask.id,
        actor: actor.username,
      });
    }

    io.to(`user:${newTask.userId}`).emit("notification", {
      type: "TASK_UPDATED",
      message: `You have been assigned a new task: "${newTask.title}"`,
      taskId: newTask.id,
      actor: actor.username,
    });

    io.to("role:ADMIN")
      .to("role:MANAGER")
      .emit("notification", {
        type: "TASK_UPDATED",
        message: `Task "${newTask.title}" has been reassigned from ${oldTask.user.username} to ${newTask.user.username}`,
        taskId: newTask.id,
        actor: actor.username,
      });

    console.log("Reassignment notifications emitted for task:", newTask.id);
  } catch (err) {
    console.error("Failed to emit reassignment notifications:", err);
  }
};

export const notifyTaskUpdatedSupport = (task, actor) => {
  if (!io) return;

  try {
    io.to("role:ADMIN")
      .to("role:MANAGER")
      .emit("notification", {
        type: "TASK_UPDATED",
        message: `Task "${task.title}" was updated by ${actor.username}`,
        taskId: task.id,
        actor: actor.username,
      });

    console.log("Admins notified about task update:", task.id);
  } catch (err) {
    console.error("Failed to notify admins:", err);
  }
};

export const commentNotification = async (comment, taskId, user) => {
  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    select: {
      title: true,
    },
  });

  if (!task) return;
  const commenters = await prisma.taskComments.findMany({
    where: {
      taskId: taskId,
      NOT: {
        userId: user.id,
      },
    },
    select: {
      userId: true,
    },
    distinct: ["userId"],
  });

  if (!commenters.length) return;

  const payload = {
    type: "COMMENT",
    taskId,
    commentId: comment.id,
    message: `${user.username} commented on a task ${task.title}`,
  };

  commenters.forEach(({ userId }) => {
    io.to(`user:${userId}`).emit("notification", payload);
  });

  console.log(
    "Comment notification sent to:",
    commenters.map((c) => c.userId),
  );
};
