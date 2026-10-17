import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const guidesKeys = {
  all: ["guides"],
  detail: (id) => ["guides", id],
};

const data = (res) => res.data;

export const guidesApi = {
  list: () => api.get("/guides").then(data),
  get: (id) => api.get(`/guides/${id}`).then(data),
  create: (values) => api.post("/guides/new", values).then(data),
  update: (id, values) => api.put(`/guides/${id}/edit`, values).then(data),
};

export const useGuides = () =>
  useQuery({ queryKey: guidesKeys.all, queryFn: guidesApi.list });

export const useGuide = (id) =>
  useQuery({
    queryKey: guidesKeys.detail(id),
    queryFn: () => guidesApi.get(id),
    enabled: Boolean(id),
  });
