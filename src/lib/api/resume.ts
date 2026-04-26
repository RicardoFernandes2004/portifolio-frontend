import { http } from "./http";
import type { ResumeHeader, UpdateResumeHeaderDto } from "./types";

export const resumeApi = {
  getHeader: () =>
    http.get<ResumeHeader>("/resume/header").then((r) => r.data),
  updateHeader: (dto: UpdateResumeHeaderDto) =>
    http.put<ResumeHeader>("/resume/header", dto).then((r) => r.data),
  /**
   * Faz download do PDF via Route Handler do próprio Next, que faz proxy.
   * Retorna um blob para o caller transformar em download.
   */
  downloadPdf: async (): Promise<Blob> => {
    const res = await fetch("/api/resume/download");
    if (!res.ok) {
      throw new Error(`Falha ao baixar PDF: ${res.status}`);
    }
    return await res.blob();
  },
};
