import { http } from "./http";
import type { CreateLanguageDto, Language, UpdateLanguageDto } from "./types";

export const languagesApi = {
  list: () => http.get<Language[]>("/languages").then((r) => r.data),
  detail: (id: number) =>
    http.get<Language>(`/languages/${id}`).then((r) => r.data),
  create: (dto: CreateLanguageDto) =>
    http.post<Language>("/languages", dto).then((r) => r.data),
  update: (id: number, dto: UpdateLanguageDto) =>
    http.put<Language>(`/languages/${id}`, dto).then((r) => r.data),
  remove: (id: number) =>
    http.delete<void>(`/languages/${id}`).then((r) => r.data),
};
