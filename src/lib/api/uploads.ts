import { http } from "./http";
import type { UploadTicket } from "./types";

export const uploadsApi = {
  /** Pede o ticket ao backend e manda o arquivo direto ao storage. Retorna a URL pública. */
  uploadImage: async (file: File): Promise<string> => {
    const ticket = await http
      .post<UploadTicket>("/uploads", { contentType: file.type })
      .then((r) => r.data);

    const form = new FormData();
    for (const [k, v] of Object.entries(ticket.fields)) form.append(k, v);
    form.append(ticket.fileField, file);

    const res = await fetch(ticket.uploadUrl, { method: "POST", body: form });
    if (!res.ok) throw new Error(`upload falhou (${res.status})`);
    return ticket.publicUrl;
  },
};
