import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const featuresKeys = {
  all: ["features"],
  detail: (id) => ["features", id],
};

const data = (res) => res.data;

export const featuresApi = {
  list: () => api.get("/features/all").then(data),
  get: (id) => api.get(`/features/${id}`).then(data),
  create: (values) => api.post("/features/new", values).then(data),
  update: (id, values) => api.put(`/features/${id}/edit`, values).then(data),
};

export const useFeatures = () =>
  useQuery({ queryKey: featuresKeys.all, queryFn: featuresApi.list });

export const useFeature = (id) =>
  useQuery({
    queryKey: featuresKeys.detail(id),
    queryFn: () => featuresApi.get(id),
    enabled: Boolean(id),
  });
