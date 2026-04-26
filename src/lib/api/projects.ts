import { http } from "./http";
import type { CreateProjectDto, Project, UpdateProjectDto } from "./types";

export const projectsApi = {
  list: () => http.get<Project[]>("/projects").then((r) => r.data),
  detail: (id: number) =>
    http.get<Project>(`/projects/${id}`).then((r) => r.data),
  create: (dto: CreateProjectDto) =>
    http.post<Project>("/projects", dto).then((r) => r.data),
  update: (id: number, dto: UpdateProjectDto) =>
    http.put<Project>(`/projects/${id}`, dto).then((r) => r.data),
  remove: (id: number) =>
    http.delete<void>(`/projects/${id}`).then((r) => r.data),
};
