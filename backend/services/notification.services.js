import { io } from "../server.js";

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

export const notifyTaskUpdate = (oldUserId, newTask, actor) => {
  if (!io) return;

  try {
    if (oldUserId) {
      io.to(`user:${oldUserId}`).emit("notification", {
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
        message: `Task "${newTask.title}" has been reassigned from ${oldUserId} to ${newTask.userId}`,
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
