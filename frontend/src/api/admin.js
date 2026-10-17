import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const adminKeys = {
  all: ["admin"],
  dashboard: ["admin", "dashboard"],
  tasks: (type) => ["admin", "tasks", type],
  task: (id) => ["admin", "task", id],
};

export const useDashboard = () =>
  useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: () => api.get("/admindata").then((res) => res.data),
  });

export const useAdminTasks = (type) =>
  useQuery({
    queryKey: adminKeys.tasks(type),
    queryFn: () => api.get(`/admindata/tasks/${type}`).then((res) => res.data),
  });

// The task plus the support agents it can be assigned to.
export const useAdminTask = (id) =>
  useQuery({
    queryKey: adminKeys.task(id),
    queryFn: () => api.get(`/admindata/task/${id}`).then((res) => res.data),
  });
