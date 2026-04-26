"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, Terminal, X } from "lucide-react";

const NAV = [
  { href: "/", label: "// home" },
  { href: "/projects", label: "// projects" },
  { href: "/experiences", label: "// experiences" },
  { href: "/blog", label: "// blog" },
  { href: "/about", label: "// about" },
  { href: "/download", label: "// resume.pdf" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "uppercase tracking-wider transition-colors relative",
                  active
                    ? "text-neon-cyan neon-text"
                    : "text-fg-dim hover:text-neon-magenta",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-neon-cyan shadow-neon-cyan" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-neon-cyan"
          aria-label="menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border/60 bg-bg-deep/95 backdrop-blur-md">
          <div className="flex flex-col gap-1 px-4 py-3 font-mono text-sm">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "py-2 px-2 uppercase tracking-wider transition-colors",
                    active
                      ? "text-neon-cyan border-l-2 border-neon-cyan"
                      : "text-fg-dim hover:text-neon-magenta",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
