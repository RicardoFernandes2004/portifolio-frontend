import { http } from "./http";
import type {
  CreateExperienceDto,
  Experience,
  UpdateExperienceDto,
} from "./types";

export const experiencesApi = {
  list: () => http.get<Experience[]>("/experiences").then((r) => r.data),
  detail: (id: number) =>
    http.get<Experience>(`/experiences/${id}`).then((r) => r.data),
  create: (dto: CreateExperienceDto) =>
    http.post<Experience>("/experiences", dto).then((r) => r.data),
  update: (id: number, dto: UpdateExperienceDto) =>
    http.put<Experience>(`/experiences/${id}`, dto).then((r) => r.data),
  remove: (id: number) =>
    http.delete<void>(`/experiences/${id}`).then((r) => r.data),
};
