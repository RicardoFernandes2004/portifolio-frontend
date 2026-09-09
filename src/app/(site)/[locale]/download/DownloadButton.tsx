"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { NeonButton } from "@/components/cyber/NeonButton";
import { CheckCircle2, Download, AlertTriangle } from "lucide-react";

type Status = "idle" | "downloading" | "done" | "error";

export function DownloadButton() {
  const t = useTranslations("download");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setStatus("downloading");
    setError(null);
    try {
      const res = await fetch(`/api/resume/download?lang=${locale}`);
      if (!res.ok) {
        throw new Error(t("failed", { status: res.status }));
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("content-disposition") ?? "";
      const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cd);
      a.download = match?.[1] ?? "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("unknownError"));
    }
  }

  return (
    <div className="space-y-3">
      <NeonButton
        size="lg"
        variant="magenta"
        loading={status === "downloading"}
        onClick={handleDownload}
        iconLeft={
          status === "done" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )
        }
        className="w-full md:w-auto"
      >
        {status === "done" ? t("done") : t("button")}
      </NeonButton>

      {status === "error" && error && (
        <div className="flex items-start gap-2 border border-neon-red/40 bg-neon-red/10 px-3 py-2 text-xs font-mono text-neon-red cyber-clip-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
