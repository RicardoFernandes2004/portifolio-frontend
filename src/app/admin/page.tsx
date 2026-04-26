import Link from "next/link";
import { apiGetSafe } from "@/lib/api/server";
import type {
  Category,
  Education,
  Experience,
  Language,
  Post,
  Project,
  Skill,
} from "@/lib/api/types";
import { GlitchText } from "@/components/cyber/GlitchText";
import { CyberCard } from "@/components/cyber/CyberCard";
import {
  FileText,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Languages,
  Tags,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [posts, projects, experiences, educations, skills, languages, categories] =
    await Promise.all([
      apiGetSafe<Post[]>("/posts/admin", { auth: true }),
      apiGetSafe<Project[]>("/projects"),
      apiGetSafe<Experience[]>("/experiences"),
      apiGetSafe<Education[]>("/educations"),
      apiGetSafe<Skill[]>("/skills"),
      apiGetSafe<Language[]>("/languages"),
      apiGetSafe<Category[]>("/categories"),
    ]);

  const allPosts = posts ?? [];
  const published = allPosts.filter((p) => p.isPublished).length;
  const drafts = allPosts.length - published;

  const stats = [
    {
      href: "/admin/posts",
      label: "posts",
      icon: FileText,
      primary: allPosts.length,
      detail: `${published} pub · ${drafts} draft`,
      variant: "cyan" as const,
    },
    {
      href: "/admin/projects",
      label: "projects",
      icon: FolderGit2,
      primary: projects?.length ?? 0,
      variant: "magenta" as const,
    },
    {
      href: "/admin/experiences",
      label: "experiences",
      icon: Briefcase,
      primary: experiences?.length ?? 0,
      variant: "purple" as const,
    },
    {
      href: "/admin/educations",
      label: "educations",
      icon: GraduationCap,
      primary: educations?.length ?? 0,
      variant: "cyan" as const,
    },
    {
      href: "/admin/skills",
      label: "skills",
      icon: Sparkles,
      primary: skills?.length ?? 0,
      variant: "yellow" as const,
    },
    {
      href: "/admin/languages",
      label: "languages",
      icon: Languages,
      primary: languages?.length ?? 0,
      variant: "magenta" as const,
    },
    {
      href: "/admin/categories",
      label: "categories",
      icon: Tags,
      primary: categories?.length ?? 0,
      variant: "purple" as const,
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl">
      <header className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          uplink established
        </p>
        <GlitchText className="text-3xl md:text-4xl">DASHBOARD</GlitchText>
        <p className="text-fg-dim">
          Sumário rápido do que está no banco. Clique em qualquer card para
          gerenciar.
        </p>
        <div className="neon-divider w-24" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href} className="group">
              <CyberCard variant={s.variant} hoverable>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-neon-cyan" />
                    <ArrowRight className="h-4 w-4 text-fg-muted group-hover:text-neon-magenta transition-colors" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted">
                      {s.label}
                    </p>
                    <p className="font-display text-4xl font-bold text-fg neon-text">
                      {s.primary}
                    </p>
                    {s.detail && (
                      <p className="font-mono text-xs text-neon-cyan mt-1">
                        {s.detail}
                      </p>
                    )}
                  </div>
                </div>
              </CyberCard>
            </Link>
          );
        })}
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <CyberCard variant="cyan">
          <div className="p-6 space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
              recent posts
            </p>
            {allPosts.slice(0, 5).length === 0 ? (
              <p className="font-mono text-xs text-fg-muted terminal-prompt">
                nenhum post.
              </p>
            ) : (
              <ul className="space-y-2 font-mono text-sm">
                {allPosts.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 border-b border-dashed border-border/50 pb-2 last:border-b-0">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="truncate hover:text-neon-cyan"
                    >
                      {p.title}
                    </Link>
                    <span
                      className={
                        p.isPublished
                          ? "text-[10px] uppercase tracking-widest text-neon-green"
                          : "text-[10px] uppercase tracking-widest text-neon-yellow"
                      }
                    >
                      {p.isPublished ? "pub" : "draft"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CyberCard>

        <CyberCard variant="magenta">
          <div className="p-6 space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-neon-magenta">
              recent projects
            </p>
            {(projects ?? []).slice(0, 5).length === 0 ? (
              <p className="font-mono text-xs text-fg-muted terminal-prompt">
                nenhum projeto.
              </p>
            ) : (
              <ul className="space-y-2 font-mono text-sm">
                {(projects ?? []).slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 border-b border-dashed border-border/50 pb-2 last:border-b-0">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="truncate hover:text-neon-magenta"
                    >
                      {p.title}
                    </Link>
                    <span className="text-[10px] uppercase tracking-widest text-neon-cyan">
                      {p.technologies?.length ?? 0} tech
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CyberCard>
      </section>
    </div>
  );
}
