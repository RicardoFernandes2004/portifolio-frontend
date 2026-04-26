import { http } from "./http";
import type { CreatePostDto, Post, UpdatePostDto } from "./types";

export const postsApi = {
  list: (categoryId?: number) =>
    http
      .get<Post[]>("/posts", {
        params: categoryId ? { categoryId } : undefined,
      })
      .then((r) => r.data),
  listAdmin: (categoryId?: number) =>
    http
      .get<Post[]>("/posts/admin", {
        params: categoryId ? { categoryId } : undefined,
      })
      .then((r) => r.data),
  bySlug: (slug: string) =>
    http.get<Post>(`/posts/slug/${slug}`).then((r) => r.data),
  detail: (id: number) => http.get<Post>(`/posts/${id}`).then((r) => r.data),
  create: (dto: CreatePostDto) =>
    http.post<Post>("/posts", dto).then((r) => r.data),
  update: (id: number, dto: UpdatePostDto) =>
    http.put<Post>(`/posts/${id}`, dto).then((r) => r.data),
  remove: (id: number) => http.delete<void>(`/posts/${id}`).then((r) => r.data),
  publish: (id: number) =>
    http.post<Post>(`/posts/${id}/publish`).then((r) => r.data),
  unpublish: (id: number) =>
    http.post<Post>(`/posts/${id}/unpublish`).then((r) => r.data),
};
