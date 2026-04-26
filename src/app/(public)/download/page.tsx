import type { Metadata } from "next";
import { apiGetSafe } from "@/lib/api/server";
import type { ResumeHeader } from "@/lib/api/types";
import { GlitchText } from "@/components/cyber/GlitchText";
import { CyberCard } from "@/components/cyber/CyberCard";
import { DownloadButton } from "./DownloadButton";
import { Globe, Linkedin, Mail, MapPin, Phone, Github } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Download CV // RC.dev" };

export default async function DownloadPage() {
  const header = await apiGetSafe<ResumeHeader>("/resume/header");

  return (
    <main className="mx-auto max-w-5xl px-4 md:px-8 py-16 md:py-20 space-y-12">
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          curl -O resume.pdf
        </p>
        <GlitchText className="text-4xl md:text-5xl">DOWNLOAD CV</GlitchText>
        <p className="text-fg-dim max-w-2xl">
          O PDF é gerado dinamicamente no backend a partir dos dados atuais
          (header + experiências + formações + skills + idiomas + projetos). Nada
          de cache: clique e leve sempre a versão mais recente.
        </p>
        <div className="neon-divider w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <CyberCard variant="cyan" className="md:col-span-3">
          <div className="p-8 md:p-10 space-y-6">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-widest text-neon-magenta">
                ready for transfer
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                {header?.name ?? "Currículo"}
              </h2>
              {header?.jobTitle && (
                <p className="font-mono text-neon-cyan">{header.jobTitle}</p>
              )}
            </div>

            <div className="space-y-2 font-mono text-xs text-fg-muted">
              <Bar label="format" value="application/pdf" />
              <Bar label="encoding" value="binary" />
              <Bar label="cache" value="no-store" />
              <Bar label="source" value="GET /resume/download" />
            </div>

            <DownloadButton />

            <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
              // tip: o arquivo será salvo como{" "}
              <span className="text-neon-cyan">resume.pdf</span>
            </p>
          </div>
        </CyberCard>

        <CyberCard variant="magenta" className="md:col-span-2">
          <div className="p-6 space-y-3 font-mono text-sm">
            <p className="text-xs uppercase tracking-widest text-neon-cyan">
              / preview
            </p>
            <Field icon={<MapPin />} value={header?.location} />
            <Field icon={<Mail />} value={header?.email} />
            <Field icon={<Phone />} value={header?.phone} />
            <Field icon={<Globe />} value={header?.website} />
            <Field icon={<Linkedin />} value={header?.linkedin} />
            <Field icon={<Github />} value={header?.github} />

            {header?.summary && (
              <>
                <div className="neon-divider my-2" />
                <p className="font-body text-xs text-fg-dim leading-relaxed line-clamp-6">
                  {header.summary}
                </p>
              </>
            )}
          </div>
        </CyberCard>
      </div>
    </main>
  );
}

function Bar({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border/60 py-1.5">
      <span className="text-fg-muted">{label}</span>
      <span className="text-neon-cyan">{value}</span>
    </div>
  );
}

function Field({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-fg-dim">
      <span className="text-neon-cyan [&>svg]:h-4 [&>svg]:w-4 mt-0.5">{icon}</span>
      <span className="break-all">{value}</span>
    </div>
  );
}
