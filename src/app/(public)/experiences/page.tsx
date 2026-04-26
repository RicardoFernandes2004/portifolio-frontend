import type { Metadata } from "next";
import { apiGetSafe } from "@/lib/api/server";
import type { Experience } from "@/lib/api/types";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Timeline, type TimelineItem } from "@/components/timeline/Timeline";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Experiências // RC.dev" };

function sortExperiences(list: Experience[]): Experience[] {
  return [...list].sort((a, b) => {
    const aDate = new Date(a.startDate).getTime();
    const bDate = new Date(b.startDate).getTime();
    return bDate - aDate;
  });
}

export default async function ExperiencesPage() {
  const experiences = sortExperiences(
    (await apiGetSafe<Experience[]>("/experiences")) ?? [],
  );

  const items: TimelineItem[] = experiences.map((e) => ({
    id: e.id,
    title: e.position,
    subtitle: e.company,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate,
    current: !e.endDate,
  }));

  return (
    <main className="mx-auto max-w-4xl px-4 md:px-8 py-16 md:py-20 space-y-12">
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          tail -f /career.log
        </p>
        <GlitchText className="text-4xl md:text-5xl">EXPERIENCES</GlitchText>
        <p className="text-fg-dim max-w-2xl">
          Histórico profissional do mais recente para o mais antigo. Cada bloco é
          um capítulo no log.
        </p>
        <div className="neon-divider w-32" />
      </div>

      <Timeline items={items} />
    </main>
  );
}
