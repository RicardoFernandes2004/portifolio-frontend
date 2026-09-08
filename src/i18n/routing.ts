import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * `/` continua em português (URLs já indexadas não mudam) e o inglês vive em
 * `/en/...`. É o que `localePrefix: "as-needed"` faz.
 */
export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/** hreflang por locale, usado nas tags <link rel="alternate">. */
export const HREFLANG: Record<Locale, string> = { pt: "pt-BR", en: "en" };

/** Locale do Intl (datas, números). */
export const INTL_LOCALE: Record<Locale, string> = { pt: "pt-BR", en: "en-US" };
