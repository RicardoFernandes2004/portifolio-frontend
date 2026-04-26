import { http } from "./http";
import type {
  CreateEducationDto,
  Education,
  UpdateEducationDto,
} from "./types";

export const educationsApi = {
  list: () => http.get<Education[]>("/educations").then((r) => r.data),
  detail: (id: number) =>
    http.get<Education>(`/educations/${id}`).then((r) => r.data),
  create: (dto: CreateEducationDto) =>
    http.post<Education>("/educations", dto).then((r) => r.data),
  update: (id: number, dto: UpdateEducationDto) =>
    http.put<Education>(`/educations/${id}`, dto).then((r) => r.data),
  remove: (id: number) =>
    http.delete<void>(`/educations/${id}`).then((r) => r.data),
};
