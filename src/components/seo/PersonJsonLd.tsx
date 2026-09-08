import { apiGetSafe } from "@/lib/api/server";
import type { ResumeHeader, Skill } from "@/lib/api/types";
import { HREFLANG, type Locale } from "@/i18n/routing";
import { tr } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

/**
 * Schema.org Person no <head> de todas as páginas públicas.
 * É o que Google e motores de resposta usam para saber de quem é o site
 * e o que essa pessoa faz.
 */
export async function PersonJsonLd({ locale }: { locale: Locale }) {
  const [header, skills] = await Promise.all([
    apiGetSafe<ResumeHeader>("/resume/header"),
    apiGetSafe<Skill[]>("/skills"),
  ]);
  if (!header) return null;

  const sameAs = [header.github, header.linkedin, header.website].filter(
    (u): u is string => Boolean(u?.trim()),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: header.name,
    jobTitle: tr(locale, header.jobTitle, header.jobTitleEn),
    description: tr(locale, header.summary, header.summaryEn),
    url: SITE_URL,
    email: header.email ? `mailto:${header.email}` : undefined,
    address: header.location
      ? { "@type": "PostalAddress", addressLocality: header.location }
      : undefined,
    knowsAbout: (skills ?? []).map((s) => s.name),
    knowsLanguage: Object.values(HREFLANG),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
