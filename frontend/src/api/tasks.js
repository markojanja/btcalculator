import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const taskKeys = {
  all: ["tasks"],
  board: ["tasks", "board"],
  handover: ["tasks", "handover"],
  comments: (taskId) => ["tasks", taskId, "comments"],
};

const data = (res) => res.data;

export const tasksApi = {
  board: () => api.get("/tasks/my_tasks").then(data),
  handover: () => api.get("/tasks/handover").then(data),
  create: (task) => api.post("/tasks/add_task", task).then((res) => res.data.task),
  update: (task) => api.put("/tasks/edit_task", task).then((res) => res.data.task),
  remove: (id) => api.put(`/tasks/delete_task/${id}`),

  comments: (taskId) => api.get(`/tasks/${taskId}/comments/all`).then(data),
  addComment: (taskId, description) =>
    api.post(`/tasks/${taskId}/comments/new`, { description }).then(data),
  updateComment: (commentId, description) =>
    api.put(`/tasks/comments/${commentId}`, { description }).then(data),
  deleteComment: (commentId) => api.delete(`/tasks/comments/${commentId}`),
};

export const useBoard = () =>
  useQuery({ queryKey: taskKeys.board, queryFn: tasksApi.board });

export const useHandover = () =>
  useQuery({ queryKey: taskKeys.handover, queryFn: tasksApi.handover });

export const useComments = (taskId) =>
  useQuery({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => tasksApi.comments(taskId),
    enabled: Boolean(taskId),
  });
