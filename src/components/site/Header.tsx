"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Menu, Terminal, X } from "lucide-react";
import type { Locale } from "@/i18n/routing";

const NAV = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/experiences", key: "experiences" },
  { href: "/blog", key: "blog" },
  { href: "/about", key: "about" },
  { href: "/download", key: "resume" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  // Sem prefixo de locale: serve para marcar o link ativo e para trocar de idioma
  // mantendo a rota atual.
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg-deep/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display font-bold text-lg"
        >
          <span className="flex h-8 w-8 items-center justify-center border border-neon-cyan text-neon-cyan cyber-clip-sm group-hover:shadow-neon-cyan transition-shadow">
            <Terminal className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">
            <span className="text-neon-cyan">RC</span>
            <span className="text-fg">.dev</span>
            <span className="ml-1 inline-block h-4 w-2 align-middle bg-neon-magenta animate-pulse-neon" />
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-mono text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "uppercase tracking-wider transition-colors relative",
                isActive(item.href)
                  ? "text-neon-cyan neon-text"
                  : "text-fg-dim hover:text-neon-magenta",
              )}
            >
              {t(item.key)}
              {isActive(item.href) && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-neon-cyan shadow-neon-cyan" />
              )}
            </Link>
          ))}
          <LocaleSwitch locale={locale} pathname={pathname} label={t("switchTo")} />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitch locale={locale} pathname={pathname} label={t("switchTo")} />
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-neon-cyan"
            aria-label={t("menu")}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border/60 bg-bg-deep/95 backdrop-blur-md">
          <div className="flex flex-col gap-1 px-4 py-3 font-mono text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-2 px-2 uppercase tracking-wider transition-colors",
                  isActive(item.href)
                    ? "text-neon-cyan border-l-2 border-neon-cyan"
                    : "text-fg-dim hover:text-neon-magenta",
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

/** Troca de idioma mantendo a rota atual (o `locale` do Link reescreve o prefixo). */
function LocaleSwitch({
  locale,
  pathname,
  label,
}: {
  locale: Locale;
  pathname: string;
  label: string;
}) {
  const next: Locale = locale === "pt" ? "en" : "pt";
  return (
    <Link
      href={pathname}
      locale={next}
      title={label}
      aria-label={label}
      className="font-mono text-xs uppercase tracking-widest border border-border px-2 py-1 cyber-clip-sm text-fg-dim hover:border-neon-cyan hover:text-neon-cyan transition-colors"
    >
      {next}
    </Link>
  );
}
