import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { apiGetSafe, PUBLIC_REVALIDATE } from "@/lib/api/server";
import type { Project } from "@/lib/api/types";
import { alternates } from "@/lib/seo";
import { tr, truncate } from "@/lib/utils";
import { GlitchText } from "@/components/cyber/GlitchText";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Chip } from "@/components/cyber/Chip";
import { NeonButton } from "@/components/cyber/NeonButton";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import {
  ArrowLeft,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";

export const revalidate = PUBLIC_REVALIDATE;

/** Mesmo motivo do blog: sem isto a rota renderiza sob demanda. */
export async function generateStaticParams() {
  const projects = await apiGetSafe<Project[]>("/projects");
  return (projects ?? []).map((project) => ({ id: String(project.id) }));
}

interface Props {
  params: { locale: Locale; id: string };
}

export async function generateMetadata({
  params: { locale, id },
}: Props): Promise<Metadata> {
  const project = await apiGetSafe<Project>(`/projects/${Number(id)}`);
  if (!project) return {};
  const title = tr(locale, project.title, project.titleEn);
  const description = tr(locale, project.description, project.descriptionEn);
  return {
    title,
    description: truncate(description, 160),
    alternates: alternates(`/projects/${id}`, locale),
    openGraph: {
      title,
      description: truncate(description, 160),
      ...(project.images?.[0] && { images: [project.images[0]] }),
    },
  };
}

export default async function ProjectDetailPage({
  params: { locale, id: rawId },
}: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("projectDetail");

  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();
  const project = await apiGetSafe<Project>(`/projects/${id}`);
  if (!project) notFound();

  const title = tr(locale, project.title, project.titleEn);
  const description = tr(locale, project.description, project.descriptionEn);

  const links: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
    variant: "cyan" | "magenta" | "yellow" | "ghost";
  }> = [];
  if (project.link)
    links.push({
      href: project.link,
      label: "live",
      icon: <ExternalLink className="h-4 w-4" />,
      variant: "cyan",
    });
  if (project.githubLink)
    links.push({
      href: project.githubLink,
      label: "github",
      icon: <Github className="h-4 w-4" />,
      variant: "magenta",
    });
  if (project.youtubeLink)
    links.push({
      href: project.youtubeLink,
      label: "youtube",
      icon: <Youtube className="h-4 w-4" />,
      variant: "ghost",
    });
  if (project.twitterLink)
    links.push({
      href: project.twitterLink,
      label: "twitter",
      icon: <Twitter className="h-4 w-4" />,
      variant: "ghost",
    });
  if (project.instagramLink)
    links.push({
      href: project.instagramLink,
      label: "instagram",
      icon: <Instagram className="h-4 w-4" />,
      variant: "ghost",
    });
  if (project.facebookLink)
    links.push({
      href: project.facebookLink,
      label: "facebook",
      icon: <Facebook className="h-4 w-4" />,
      variant: "ghost",
    });

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-20 space-y-12">
      <div>
        <Link href="/projects">
          <NeonButton variant="ghost" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {t("back")}
          </NeonButton>
        </Link>
      </div>

      <header className="space-y-5">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          project::{String(project.id).padStart(3, "0")}
        </p>
        <GlitchText className="text-4xl md:text-6xl">{title}</GlitchText>
        <div className="neon-divider w-32" />
        <p className="text-lg text-fg-dim max-w-3xl whitespace-pre-line">
          {description}
        </p>

        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((t) => (
              <Chip key={t} variant="purple">
                {t}
              </Chip>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                <NeonButton variant={l.variant} iconLeft={l.icon}>
                  {l.label}
                </NeonButton>
              </a>
            ))}
          </div>
        )}
      </header>

      {project.images?.length > 0 && (
        <ProjectGallery images={project.images} title={title} />
      )}

      {project.collaborators?.length > 0 && (
        <CyberCard variant="cyan">
          <div className="p-6 space-y-3">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-cyan">
              <Users className="h-4 w-4" /> {t("collaborators")}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {project.collaborators.map((c) => (
                <li key={c}>
                  <Chip variant="cyan">{c}</Chip>
                </li>
              ))}
            </ul>
          </div>
        </CyberCard>
      )}
    </main>
  );
}
