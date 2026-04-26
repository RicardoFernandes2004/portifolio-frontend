import { http } from "./http";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "./types";

export const categoriesApi = {
  list: () => http.get<Category[]>("/categories").then((r) => r.data),
  detail: (id: number) =>
    http.get<Category>(`/categories/${id}`).then((r) => r.data),
  create: (dto: CreateCategoryDto) =>
    http.post<Category>("/categories", dto).then((r) => r.data),
  update: (id: number, dto: UpdateCategoryDto) =>
    http.put<Category>(`/categories/${id}`, dto).then((r) => r.data),
  remove: (id: number) =>
    http.delete<void>(`/categories/${id}`).then((r) => r.data),
};
