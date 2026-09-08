import type { Metadata } from "next";
import { getPathname, routing, HREFLANG, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/** URL absoluta de uma rota interna em um locale. */
export function absoluteUrl(pathname: string, locale: Locale): string {
  return `${SITE_URL}${getPathname({ href: pathname, locale })}`;
}

/**
 * canonical + hreflang de uma rota. O `x-default` aponta para o português,
 * que é o locale sem prefixo.
 */
export function alternates(
  pathname: string,
  locale: Locale,
): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(pathname, locale),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [HREFLANG[l], absoluteUrl(pathname, l)]),
      ),
      "x-default": absoluteUrl(pathname, routing.defaultLocale),
    },
  };
}
