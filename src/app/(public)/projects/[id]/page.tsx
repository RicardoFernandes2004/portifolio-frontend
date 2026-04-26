import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGetSafe } from "@/lib/api/server";
import type { Project } from "@/lib/api/types";
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

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: Params) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const project = await apiGetSafe<Project>(`/projects/${id}`);
  if (!project) notFound();

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
            voltar
          </NeonButton>
        </Link>
      </div>

      <header className="space-y-5">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          project::{String(project.id).padStart(3, "0")}
        </p>
        <GlitchText className="text-4xl md:text-6xl">{project.title}</GlitchText>
        <div className="neon-divider w-32" />
        <p className="text-lg text-fg-dim max-w-3xl whitespace-pre-line">
          {project.description}
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
        <ProjectGallery images={project.images} title={project.title} />
      )}

      {project.collaborators?.length > 0 && (
        <CyberCard variant="cyan">
          <div className="p-6 space-y-3">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-cyan">
              <Users className="h-4 w-4" /> collaborators
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
