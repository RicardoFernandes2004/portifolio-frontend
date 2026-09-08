import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { apiGetSafe, PUBLIC_REVALIDATE } from "@/lib/api/server";
import type { Experience } from "@/lib/api/types";
import type { Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { tr } from "@/lib/utils";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Timeline, type TimelineItem } from "@/components/timeline/Timeline";

export const revalidate = PUBLIC_REVALIDATE;

interface Props {
  params: { locale: Locale };
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "experiences" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates("/experiences", locale),
  };
}

function sortExperiences(list: Experience[]): Experience[] {
  return [...list].sort((a, b) => {
    const aDate = new Date(a.startDate).getTime();
    const bDate = new Date(b.startDate).getTime();
    return bDate - aDate;
  });
}

export default async function ExperiencesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("experiences");

  const experiences = sortExperiences(
    (await apiGetSafe<Experience[]>("/experiences")) ?? [],
  );

  const items: TimelineItem[] = experiences.map((e) => ({
    id: e.id,
    title: tr(locale, e.position, e.positionEn),
    subtitle: e.company,
    description: tr(locale, e.description, e.descriptionEn),
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
        <p className="text-fg-dim max-w-2xl">{t("description")}</p>
        <div className="neon-divider w-32" />
      </div>

      <Timeline items={items} locale={locale} />
    </main>
  );
}
