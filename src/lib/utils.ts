import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!input) return "—";
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "short",
    ...opts,
  }).format(d);
}

export function formatDateRange(start?: string | null, end?: string | null): string {
  const s = start ? formatDate(start) : "—";
  const e = end ? formatDate(end) : "presente";
  return `${s} → ${e}`;
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function levelToBars(level: number, max = 5): boolean[] {
  const filled = Math.max(0, Math.min(max, Math.round(level)));
  return Array.from({ length: max }, (_, i) => i < filled);
}
