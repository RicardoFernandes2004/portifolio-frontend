import { http } from "./http";
import type { ResumeHeader, UpdateResumeHeaderDto } from "./types";

export const resumeApi = {
  getHeader: () =>
    http.get<ResumeHeader>("/resume/header").then((r) => r.data),
  updateHeader: (dto: UpdateResumeHeaderDto) =>
    http.put<ResumeHeader>("/resume/header", dto).then((r) => r.data),
};
