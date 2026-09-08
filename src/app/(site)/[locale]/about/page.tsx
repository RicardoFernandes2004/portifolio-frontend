import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { tr } from "@/lib/utils";
import { apiGetSafe, PUBLIC_REVALIDATE } from "@/lib/api/server";
import type {
  Education,
  Language,
  ResumeHeader,
  Skill,
} from "@/lib/api/types";
import { GlitchText } from "@/components/cyber/GlitchText";
import { CyberCard } from "@/components/cyber/CyberCard";
import { SectionHeader } from "@/components/cyber/SectionHeader";
import { LevelBars } from "@/components/cyber/LevelBars";
import { Timeline, type TimelineItem } from "@/components/timeline/Timeline";
import { NeonButton } from "@/components/cyber/NeonButton";
import {
  Download,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export const revalidate = PUBLIC_REVALIDATE;

interface Props {
  params: { locale: Locale };
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates("/about", locale),
  };
}

export default async function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const [header, skills, languages, educations] = await Promise.all([
    apiGetSafe<ResumeHeader>("/resume/header"),
    apiGetSafe<Skill[]>("/skills"),
    apiGetSafe<Language[]>("/languages"),
    apiGetSafe<Education[]>("/educations"),
  ]);

  const sortedSkills = [...(skills ?? [])].sort((a, b) => b.level - a.level);
  const sortedLanguages = [...(languages ?? [])].sort(
    (a, b) => b.level - a.level,
  );
  const eduItems: TimelineItem[] = [...(educations ?? [])]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )
    .map((e) => ({
      id: e.id,
      title: `${tr(locale, e.degree, e.degreeEn)} · ${tr(locale, e.fieldOfStudy, e.fieldOfStudyEn)}`,
      subtitle: e.school,
      startDate: e.startDate,
      endDate: e.endDate,
    }));

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-8 py-16 md:py-20 space-y-16">
      {/* HEADER */}
      <section className="space-y-8">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          cat /about_me.md
        </p>
        <GlitchText className="text-3xl sm:text-4xl md:text-6xl">ABOUT ME</GlitchText>
        <div className="neon-divider w-32" />

        {header ? (
          <div className="grid gap-6 md:grid-cols-3">
            <CyberCard variant="cyan" className="md:col-span-2">
              <div className="p-6 md:p-8 space-y-4">
                <p className="font-mono text-xs uppercase tracking-widest text-neon-magenta">
                  {t("identity")}
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold">
                  {header.name}
                </h2>
                <p className="text-neon-cyan font-mono">
                  {tr(locale, header.jobTitle, header.jobTitleEn)}
                </p>
                <p className="text-fg-dim leading-relaxed whitespace-pre-line break-words overflow-hidden">
                  {tr(locale, header.summary, header.summaryEn)}
                </p>
                <Link href="/download" className="inline-block pt-2">
                  <NeonButton variant="magenta" iconLeft={<Download className="h-4 w-4" />}>
                    {t("downloadCv")}
                  </NeonButton>
                </Link>
              </div>
            </CyberCard>

            <CyberCard variant="magenta">
              <div className="p-4 sm:p-6 space-y-3 font-mono text-sm min-w-0 overflow-hidden">
                <p className="text-xs uppercase tracking-widest text-neon-cyan">
                  {t("contact")}
                </p>
                <ContactRow icon={<MapPin />} value={header.location} />
                <ContactRow icon={<Mail />} value={header.email} href={`mailto:${header.email}`} />
                <ContactRow icon={<Phone />} value={header.phone} href={`tel:${header.phone}`} />
                <ContactRow icon={<Globe />} value={header.website} href={header.website} />
                <ContactRow icon={<Linkedin />} value="linkedin" href={header.linkedin} />
                <ContactRow icon={<Github />} value="github" href={header.github} />
              </div>
            </CyberCard>
          </div>
        ) : (
          <p className="font-mono text-sm text-fg-muted terminal-prompt">
            {t("headerUnavailable")}
          </p>
        )}
      </section>

      <div className="neon-divider" />

      {/* SKILLS */}
      <section className="space-y-8">
        <SectionHeader eyebrow="// 01" title={t("skills")} />
        {sortedSkills.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {sortedSkills.map((s) => (
              <CyberCard key={s.id} variant="cyan" hoverable>
                <div className="p-3 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-3 min-w-0">
                      {s.icon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.icon}
                          alt=""
                          className="h-6 w-6 object-contain"
                        />
                      )}
                      <span className="font-display font-semibold truncate text-sm sm:text-base">
                        {s.name}
                      </span>
                    </div>
                    <LevelBars level={s.level} variant="cyan" />
                  </div>
                  {s.description && (
                    <p className="font-body text-sm text-fg-dim">
                      {tr(locale, s.description, s.descriptionEn)}
                    </p>
                  )}
                </div>
              </CyberCard>
            ))}
          </div>
        ) : (
          <Empty label={t("empty")} />
        )}
      </section>

      <div className="neon-divider" />

      {/* LANGUAGES */}
      <section className="space-y-8">
        <SectionHeader eyebrow="// 02" title={t("languages")} />
        {sortedLanguages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {sortedLanguages.map((l) => (
              <CyberCard key={l.id} variant="magenta" hoverable>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold">
                      {tr(locale, l.name, l.nameEn)}
                    </span>
                    <span className="font-mono text-xs text-neon-magenta">
                      lvl {l.level}/5
                    </span>
                  </div>
                  <LevelBars level={l.level} variant="magenta" />
                </div>
              </CyberCard>
            ))}
          </div>
        ) : (
          <Empty label={t("empty")} />
        )}
      </section>

      <div className="neon-divider" />

      {/* EDUCATIONS */}
      <section className="space-y-8">
        <SectionHeader eyebrow="// 03" title={t("educations")} />
        <Timeline items={eduItems} locale={locale} accent="magenta" />
      </section>
    </main>
  );
}

function ContactRow({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode;
  value?: string | null;
  href?: string;
}) {
  if (!value) return null;
  const inner = (
    <span className="flex items-center gap-2 text-fg-dim min-w-0">
      <span className="text-neon-cyan [&>svg]:h-4 [&>svg]:w-4 shrink-0">{icon}</span>
      <span className="truncate text-xs sm:text-sm">{value}</span>
    </span>
  );
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="block hover:text-neon-cyan transition-colors"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

function Empty({ label }: { label: string }) {
  return (
    <CyberCard variant="purple">
      <div className="p-10 text-center">
        <p className="font-mono text-sm text-fg-muted terminal-prompt">
          {label}
        </p>
      </div>
    </CyberCard>
  );
}
