import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiGetSafe, PUBLIC_REVALIDATE } from "@/lib/api/server";
import type { Project } from "@/lib/api/types";
import type { Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { GlitchText } from "@/components/cyber/GlitchText";
import { CyberCard } from "@/components/cyber/CyberCard";

export const revalidate = PUBLIC_REVALIDATE;

interface Props {
  params: { locale: Locale };
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates("/projects", locale),
  };
}

export default async function ProjectsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = (await apiGetSafe<Project[]>("/projects")) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20 space-y-10">
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          ls /projects
        </p>
        <GlitchText className="text-4xl md:text-5xl">PROJECTS</GlitchText>
        <p className="text-fg-dim max-w-2xl">
          {t("count", { count: projects.length })}
        </p>
        <div className="neon-divider w-32" />
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} locale={locale} />
          ))}
        </div>
      ) : (
        <CyberCard variant="purple">
          <div className="p-12 text-center">
            <p className="font-mono text-sm text-fg-muted terminal-prompt">
              {t("empty")}
            </p>
          </div>
        </CyberCard>
      )}
    </main>
  );
}
