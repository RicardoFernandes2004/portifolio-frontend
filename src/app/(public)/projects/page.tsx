import type { Metadata } from "next";
import { apiGetSafe } from "@/lib/api/server";
import type { Project } from "@/lib/api/types";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { CyberCard } from "@/components/cyber/CyberCard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projetos // RC.dev" };

export default async function ProjectsPage() {
  const projects = (await apiGetSafe<Project[]>("/projects")) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20 space-y-10">
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          ls /projects
        </p>
        <GlitchText className="text-4xl md:text-5xl">PROJECTS</GlitchText>
        <p className="text-fg-dim max-w-2xl">
          {projects.length} {projects.length === 1 ? "registro" : "registros"} no
          repositório. Clique em qualquer card para detalhes técnicos completos.
        </p>
        <div className="neon-divider w-32" />
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <CyberCard variant="purple">
          <div className="p-12 text-center">
            <p className="font-mono text-sm text-fg-muted terminal-prompt">
              nenhum projeto cadastrado ainda.
            </p>
          </div>
        </CyberCard>
      )}
    </main>
  );
}
