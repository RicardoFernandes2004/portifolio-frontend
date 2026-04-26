import { http } from "./http";
import type { CreateSkillDto, Skill, UpdateSkillDto } from "./types";

export const skillsApi = {
  list: () => http.get<Skill[]>("/skills").then((r) => r.data),
  detail: (id: number) => http.get<Skill>(`/skills/${id}`).then((r) => r.data),
  create: (dto: CreateSkillDto) =>
    http.post<Skill>("/skills", dto).then((r) => r.data),
  update: (id: number, dto: UpdateSkillDto) =>
    http.put<Skill>(`/skills/${id}`, dto).then((r) => r.data),
  remove: (id: number) => http.delete<void>(`/skills/${id}`).then((r) => r.data),
};
