import Link from "next/link";
import { apiGetSafe } from "@/lib/api/server";
import type { Post, Project, ResumeHeader } from "@/lib/api/types";
import { GlitchText } from "@/components/cyber/GlitchText";
import { NeonButton } from "@/components/cyber/NeonButton";
import { CyberCard } from "@/components/cyber/CyberCard";
import { SectionHeader } from "@/components/cyber/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PostCard } from "@/components/blog/PostCard";
import { MotionFade } from "@/components/cyber/MotionFade";
import {
  ArrowRight,
  Download,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [header, projects, posts] = await Promise.all([
    apiGetSafe<ResumeHeader>("/resume/header"),
    apiGetSafe<Project[]>("/projects"),
    apiGetSafe<Post[]>("/posts"),
  ]);

  const featuredProjects = (projects ?? []).slice(0, 3);
  const recentPosts = (posts ?? []).slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8 pb-20">
      {/* HERO */}
      <section className="relative grid gap-10 py-16 md:py-24 md:grid-cols-12">
        <div className="md:col-span-8 space-y-7 animate-slide-up">
          <p className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
            init session :: status[OK]
          </p>
          <div className="space-y-2">
            <p className="font-mono text-fg-dim">
              <span className="text-neon-magenta">const</span>{" "}
              <span className="text-neon-yellow">user</span> ={" "}
              <span className="text-neon-green">"{header?.name ?? "Ricardo"}"</span>
            </p>
            <GlitchText as="h1" className="text-5xl md:text-7xl">
              {(header?.jobTitle ?? "SOFTWARE ENGINEER").toUpperCase()}
            </GlitchText>
            <div className="h-1 w-24 bg-gradient-to-r from-neon-cyan to-neon-magenta" />
          </div>
          <p className="font-body text-lg md:text-xl text-fg-dim max-w-2xl leading-relaxed">
            {header?.summary ??
              "Engenheiro de software construindo experiências digitais futuristas. APIs robustas, interfaces que respiram neon e código que dorme em paz."}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/projects">
              <NeonButton size="lg" variant="cyan" iconRight={<ArrowRight className="h-4 w-4" />}>
                explore work
              </NeonButton>
            </Link>
            <Link href="/download">
              <NeonButton size="lg" variant="magenta" iconLeft={<Download className="h-4 w-4" />}>
                download CV
              </NeonButton>
            </Link>
            <Link href="/blog">
              <NeonButton size="lg" variant="ghost" iconLeft={<FileText className="h-4 w-4" />}>
                read blog
              </NeonButton>
            </Link>
          </div>

          {header && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 font-mono text-xs text-fg-muted">
              {header.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-neon-cyan" />
                  {header.location}
                </span>
              )}
              {header.email && (
                <a
                  href={`mailto:${header.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-neon-cyan"
                >
                  <Mail className="h-3.5 w-3.5 text-neon-cyan" />
                  {header.email}
                </a>
              )}
              {header.github && (
                <a
                  href={header.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-neon-cyan"
                >
                  <Github className="h-3.5 w-3.5 text-neon-cyan" />
                  github
                </a>
              )}
              {header.linkedin && (
                <a
                  href={header.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-neon-cyan"
                >
                  <Linkedin className="h-3.5 w-3.5 text-neon-cyan" />
                  linkedin
                </a>
              )}
            </div>
          )}
        </div>

        <MotionFade delay={0.2} className="md:col-span-4 flex items-start justify-center md:justify-end">
          <CyberCard variant="purple" className="w-full max-w-xs">
            <div className="p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between text-fg-muted uppercase tracking-widest">
                <span>system.status</span>
                <span className="flex items-center gap-1.5 text-neon-green">
                  <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse-neon" />
                  online
                </span>
              </div>
              <div className="space-y-1.5 text-fg-dim">
                <Row label="uptime" value="∞" />
                <Row label="stack" value="next.js 14" />
                <Row label="auth" value="jwt::ok" />
                <Row label="theme" value="cyberpunk" valueClass="text-neon-magenta" />
                <Row label="caffeine" value="critical" valueClass="text-neon-yellow" />
              </div>
              <div className="border-t border-border/60 pt-3">
                <p className="terminal-prompt text-neon-cyan">
                  ready to deploy.
                </p>
              </div>
            </div>
          </CyberCard>
        </MotionFade>
      </section>

      <div className="neon-divider" />

      {/* FEATURED PROJECTS */}
      <section className="py-16 md:py-20 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeader
            eyebrow="featured // 02"
            title="Projetos em destaque"
            description="Recortes do que construí ultimamente — full code, full neon."
          />
          <Link href="/projects">
            <NeonButton variant="ghost" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
              ver todos
            </NeonButton>
          </Link>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <EmptyHint label="Nenhum projeto cadastrado ainda." />
        )}
      </section>

      <div className="neon-divider" />

      {/* RECENT POSTS */}
      <section className="py-16 md:py-20 space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeader
            eyebrow="latest // 03"
            title="Do blog"
            description="Notas técnicas, decisões de arquitetura e tudo que acho que vale registro."
          />
          <Link href="/blog">
            <NeonButton variant="ghost" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
              todos os posts
            </NeonButton>
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <EmptyHint label="Nenhum post publicado ainda." />
        )}
      </section>

      <div className="neon-divider" />

      {/* CTA */}
      <section className="py-16 md:py-24">
        <CyberCard variant="cyan">
          <div className="p-8 md:p-12 grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-magenta terminal-prompt">
                ready to collab
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold">
                Vamos construir algo que <span className="text-neon-cyan">brilhe</span>?
              </h3>
              <p className="text-fg-dim max-w-xl">
                Disponível para projetos freelance, consultoria e oportunidades full-time.
                Mande um sinal.
              </p>
            </div>
            <div className="flex gap-3">
              <a href={`mailto:${header?.email ?? "hello@example.com"}`}>
                <NeonButton size="lg" variant="cyan" iconLeft={<Sparkles className="h-4 w-4" />}>
                  contato
                </NeonButton>
              </a>
            </div>
          </div>
        </CyberCard>
      </section>
    </main>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className={valueClass ?? "text-neon-cyan"}>{value}</span>
    </div>
  );
}

function EmptyHint({ label }: { label: string }) {
  return (
    <CyberCard variant="purple">
      <div className="p-10 text-center">
        <p className="font-mono text-sm text-fg-muted terminal-prompt">{label}</p>
      </div>
    </CyberCard>
  );
}
