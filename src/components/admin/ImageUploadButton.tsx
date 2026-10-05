"use client";

import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { extractErrorMessage, uploadsApi } from "@/lib/api";
import { useToast } from "./Toast";

interface ImageUploadButtonProps {
  /** Recebe as URLs públicas de todos os arquivos enviados, na ordem escolhida. */
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
}

export function ImageUploadButton({
  onUploaded,
  multiple,
}: ImageUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(uploadsApi.uploadImage),
      );
      onUploaded(urls);
      toast.push(urls.length > 1 ? `${urls.length} imagens enviadas` : "imagem enviada");
    } catch (err) {
      toast.push(extractErrorMessage(err), "error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label
      className="flex items-center px-3 py-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all cursor-pointer has-[:disabled]:opacity-50 has-[:disabled]:cursor-wait"
      aria-label="enviar imagem"
      title="enviar imagem"
    >
      {uploading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Upload className="h-4 w-4" />
      )}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={uploading}
        className="sr-only"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </label>
  );
}
