import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const usersKeys = {
  all: ["users"],
  detail: (id) => ["users", id],
};

const data = (res) => res.data;

export const usersApi = {
  list: () => api.get("/users/all").then(data),
  get: (id) => api.get(`/users/${id}/edit`).then(data),
  create: (values) => api.post("/users/new", values).then(data),
  update: (id, values) => api.put(`/users/${id}/edit`, values).then(data),
};

export const useUsers = () =>
  useQuery({ queryKey: usersKeys.all, queryFn: usersApi.list });

export const useUser = (id) =>
  useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.get(id),
    enabled: Boolean(id),
  });

export const useUserStats = (id) =>
  useQuery({
    queryKey: ["users", id, "stats"],
    queryFn: () => api.get(`/stats/users/${id}`).then(data),
  });
