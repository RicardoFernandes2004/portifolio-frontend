import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { apiGetSafe, PUBLIC_REVALIDATE } from "@/lib/api/server";
import type { Post, Project, ResumeHeader } from "@/lib/api/types";
import { alternates } from "@/lib/seo";
import { tr } from "@/lib/utils";
import { GlitchText } from "@/components/cyber/GlitchText";
import { NeonButton } from "@/components/cyber/NeonButton";
import { CyberCard } from "@/components/cyber/CyberCard";
import { HeroVideo } from "@/components/cyber/HeroVideo";
import { CoverMask } from "@/components/cyber/CoverMask";
import { SectionHeader } from "@/components/cyber/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PostCard } from "@/components/blog/PostCard";
import {
  ArrowRight,
  ChevronDown,
  Download,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

export const revalidate = PUBLIC_REVALIDATE;

interface Props {
  params: { locale: Locale };
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  return { alternates: alternates("/", locale) };
}

export default async function HomePage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [header, projects, posts] = await Promise.all([
    apiGetSafe<ResumeHeader>("/resume/header"),
    apiGetSafe<Project[]>("/projects"),
    apiGetSafe<Post[]>("/posts"),
  ]);

  const featuredProjects = (projects ?? []).slice(0, 3);
  const recentPosts = (posts ?? []).slice(0, 3);

  const jobTitle = header
    ? tr(locale, header.jobTitle, header.jobTitleEn)
    : t("heroFallbackTitle");
  const summary = header
    ? tr(locale, header.summary, header.summaryEn)
    : t("heroFallbackSummary");

  return (
    <main>
      {/* HERO: fica preso no topo enquanto o resto da pagina sobe por cima */}
      <section className="hero-cover relative isolate md:sticky md:top-0 -mt-16 min-h-[100svh] overflow-hidden pt-16 flex flex-col justify-center">
        <CoverMask />
        <div className="hero-fade absolute inset-0 -z-10">
          <HeroVideo className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/90 via-bg-deep/50 to-bg-deep/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-deep to-transparent" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-12 md:px-8">
        <div className="md:col-span-8 space-y-7">
          <p className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-neon-cyan terminal-prompt animate-slide-up [animation-fill-mode:backwards]">
            init session :: status[OK]
          </p>
          <div className="space-y-2">
            {/* --chars = tamanho da linha em ch, usado pela animacao de digitacao */}
            <p
              className="typing font-mono text-fg-dim"
              style={{ "--chars": `${(header?.name ?? "Ricardo").length + 16}ch` } as CSSProperties}
            >
              <span className="text-neon-magenta">const</span>{" "}
              <span className="text-neon-yellow">user</span> ={" "}
              <span className="text-neon-green">"{header?.name ?? "Ricardo"}"</span>
            </p>
            <div className="animate-slide-up [animation-delay:0.3s] [animation-fill-mode:backwards]">
              <GlitchText as="h1" className="text-5xl md:text-7xl">
                {jobTitle.toUpperCase()}
              </GlitchText>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-neon-cyan to-neon-magenta animate-pulse-neon" />
          </div>
          <p className="font-body text-lg md:text-xl text-fg max-w-2xl leading-relaxed animate-slide-up [animation-delay:0.5s] [animation-fill-mode:backwards]">
            {summary}
          </p>

          <div className="flex flex-wrap gap-3 pt-2 animate-slide-up [animation-delay:0.7s] [animation-fill-mode:backwards]">
            <Link href="/projects">
              <NeonButton size="lg" variant="cyan" iconRight={<ArrowRight className="h-4 w-4" />}>
                {t("exploreWork")}
              </NeonButton>
            </Link>
            <Link href="/download">
              <NeonButton size="lg" variant="magenta" iconLeft={<Download className="h-4 w-4" />}>
                {t("downloadCv")}
              </NeonButton>
            </Link>
            <Link href="/blog">
              <NeonButton size="lg" variant="ghost" iconLeft={<FileText className="h-4 w-4" />}>
                {t("readBlog")}
              </NeonButton>
            </Link>
          </div>

          {header && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 font-mono text-xs text-fg-dim animate-fade-in [animation-delay:0.9s] [animation-fill-mode:backwards]">
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

        <div className="md:col-span-4 flex items-start justify-center md:justify-end animate-slide-up [animation-delay:0.9s] [animation-fill-mode:backwards]">
          <CyberCard variant="purple" className="w-full max-w-xs animate-float hover:shadow-neon-purple transition-shadow">
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
        </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan/80 animate-bounce">
          scroll
          <ChevronDown className="h-4 w-4" />
        </div>
      </section>

      {/* Conteudo que sobe por cima do hero; o CoverMask apaga o hero daqui pra baixo */}
      <div className="relative z-10 pb-20">
        <div className="neon-divider" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
      {/* FEATURED PROJECTS */}
      <section className="py-16 md:py-20 space-y-8">
        <div className="reveal flex items-end justify-between gap-4 flex-wrap">
          <SectionHeader
            eyebrow="featured // 02"
            title={t("featuredTitle")}
            description={t("featuredDescription")}
          />
          <Link href="/projects">
            <NeonButton variant="ghost" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
              {t("seeAll")}
            </NeonButton>
          </Link>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <div key={p.id} className="reveal">
                <ProjectCard project={p} locale={locale} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyHint label={t("emptyProjects")} />
        )}
      </section>

      <div className="neon-divider" />

      {/* RECENT POSTS */}
      <section className="py-16 md:py-20 space-y-8">
        <div className="reveal flex items-end justify-between gap-4 flex-wrap">
          <SectionHeader
            eyebrow="latest // 03"
            title={t("blogTitle")}
            description={t("blogDescription")}
          />
          <Link href="/blog">
            <NeonButton variant="ghost" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
              {t("allPosts")}
            </NeonButton>
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((p) => (
              <div key={p.id} className="reveal">
                <PostCard post={p} locale={locale} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyHint label={t("emptyPosts")} />
        )}
      </section>

      <div className="neon-divider" />

      {/* CTA */}
      <section className="reveal py-16 md:py-24">
        <CyberCard variant="cyan" hoverable>
          <div className="p-8 md:p-12 grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-magenta terminal-prompt">
                ready to collab
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold">
                {t.rich("ctaHeadline", {
                  glow: (chunks) => (
                    <span className="text-neon-cyan">{chunks}</span>
                  ),
                })}
              </h3>
              <p className="text-fg-dim max-w-xl">{t("ctaBody")}</p>
            </div>
            <div className="flex gap-3">
              <a href={`mailto:${header?.email ?? "hello@example.com"}`}>
                <NeonButton size="lg" variant="cyan" iconLeft={<Sparkles className="h-4 w-4" />}>
                  {t("ctaButton")}
                </NeonButton>
              </a>
            </div>
          </div>
        </CyberCard>
      </section>
      </div>
      </div>
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
    <CyberCard variant="purple" hoverable>
      <div className="p-10 text-center">
        <p className="font-mono text-sm text-fg-muted terminal-prompt">{label}</p>
      </div>
    </CyberCard>
  );
}
