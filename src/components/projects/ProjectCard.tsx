import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/lib/api/types";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Chip } from "@/components/cyber/Chip";
import { ArrowUpRight, Github } from "lucide-react";
import { tr, truncate } from "@/lib/utils";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const cover = project.images?.[0];
  const title = tr(locale, project.title, project.titleEn);
  const description = tr(locale, project.description, project.descriptionEn);
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <CyberCard variant="cyan" hoverable className="h-full">
        <div className="flex h-full flex-col">
          <div className="relative aspect-video overflow-hidden bg-bg-deep border-b border-border/60">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={title}
                className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div
                className="h-full w-full bg-grid-pattern bg-grid-md opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,43,214,0.15) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
              <span className="text-neon-cyan">// project_{String(project.id).padStart(3, "0")}</span>
              <ArrowUpRight className="h-4 w-4 text-neon-magenta opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex-1 p-5 space-y-3">
            <h3 className="font-display text-lg font-bold text-fg group-hover:text-neon-cyan transition-colors">
              {title}
            </h3>
            <p className="font-body text-sm text-fg-dim">
              {truncate(description, 140)}
            </p>
            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.slice(0, 5).map((t) => (
                  <Chip key={t} variant="purple">
                    {t}
                  </Chip>
                ))}
                {project.technologies.length > 5 && (
                  <Chip variant="cyan">+{project.technologies.length - 5}</Chip>
                )}
              </div>
            )}
            <div className="flex items-center gap-3 pt-2 text-xs font-mono text-fg-muted">
              {project.githubLink && (
                <span className="inline-flex items-center gap-1">
                  <Github className="h-3 w-3" /> repo
                </span>
              )}
              {project.link && (
                <span className="inline-flex items-center gap-1 text-neon-cyan">
                  <ArrowUpRight className="h-3 w-3" /> live
                </span>
              )}
            </div>
          </div>
        </div>
      </CyberCard>
    </Link>
  );
}
