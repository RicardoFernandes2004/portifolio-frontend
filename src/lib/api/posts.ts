import { http } from "./http";
import type {
  Comment,
  CreateCommentDto,
  CreatePostDto,
  LikeResponse,
  Post,
  UpdatePostDto,
  ViewResponse,
} from "./types";

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

  listComments: (postId: number) =>
    http.get<Comment[]>(`/posts/${postId}/comments`).then((r) => r.data),
  createComment: (postId: number, dto: CreateCommentDto) =>
    http.post<Comment>(`/posts/${postId}/comments`, dto).then((r) => r.data),

  like: (id: number) =>
    http.post<LikeResponse>(`/posts/${id}/like`).then((r) => r.data),
  unlike: (id: number) =>
    http.delete<LikeResponse>(`/posts/${id}/like`).then((r) => r.data),
  view: (id: number) =>
    http.post<ViewResponse>(`/posts/${id}/view`).then((r) => r.data),

  pendingComments: () =>
    http.get<Comment[]>("/posts/comments/pending").then((r) => r.data),
  approveComment: (id: number) =>
    http.post<Comment>(`/posts/comments/${id}/approve`).then((r) => r.data),
  deleteComment: (id: number) =>
    http.delete<void>(`/posts/comments/${id}`).then((r) => r.data),
};
