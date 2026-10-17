import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const clientsKeys = {
  all: ["clients"],
  detail: (id) => ["clients", id],
};

const data = (res) => res.data;

export const clientsApi = {
  list: () => api.get("/clients").then(data),
  get: (id) => api.get(`/clients/${id}/edit`).then(data),
  create: (values) => api.post("/clients/new", values).then(data),
  update: (id, values) => api.put(`/clients/${id}/edit`, values).then(data),
};

export const useClients = () =>
  useQuery({ queryKey: clientsKeys.all, queryFn: clientsApi.list });

export const useClient = (id) =>
  useQuery({
    queryKey: clientsKeys.detail(id),
    queryFn: () => clientsApi.get(id),
    enabled: Boolean(id),
  });

export const useActiveClients = () =>
  useQuery({
    queryKey: ["clients", "active"],
    queryFn: () => api.get("/clients/active").then(data),
  });
