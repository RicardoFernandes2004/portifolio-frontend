import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { INTL_LOCALE, type Locale } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  input: string | Date | null | undefined,
  locale: Locale = "pt",
  opts?: Intl.DateTimeFormatOptions,
): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    year: "numeric",
    month: "short",
    ...opts,
  }).format(d);
}

export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  locale: Locale = "pt",
  presentLabel = "presente",
): string {
  const s = start ? formatDate(start, locale) : "—";
  const e = end ? formatDate(end, locale) : presentLabel;
  return `${s} → ${e}`;
}

/**
 * Escolhe a tradução do conteúdo que vem do banco.
 * Sem tradução ainda? Cai no português — nunca renderiza vazio.
 */
export function tr<T>(locale: Locale, pt: T, en?: T | null): T {
  return locale === "en" && en ? en : pt;
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function levelToBars(level: number, max = 5): boolean[] {
  const filled = Math.max(0, Math.min(max, Math.round(level)));
  return Array.from({ length: max }, (_, i) => i < filled);
}
