"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Languages,
  Tags,
  IdCard,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearCachedToken } from "@/lib/api/http";

const NAV = [
  { href: "/admin", label: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "posts", icon: FileText },
  { href: "/admin/projects", label: "projects", icon: FolderGit2 },
  { href: "/admin/experiences", label: "experiences", icon: Briefcase },
  { href: "/admin/educations", label: "educations", icon: GraduationCap },
  { href: "/admin/skills", label: "skills", icon: Sparkles },
  { href: "/admin/languages", label: "languages", icon: Languages },
  { href: "/admin/categories", label: "categories", icon: Tags },
  { href: "/admin/resume", label: "resume header", icon: IdCard },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    clearCachedToken();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="md:hidden sticky top-16 z-30 border-b border-border/60 bg-bg-deep/90 backdrop-blur">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-widest text-neon-cyan"
      >
        <span>// admin menu</span>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="border-t border-border/60 px-3 py-3 space-y-0.5 font-mono text-sm bg-bg-deep/95">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 cyber-clip-sm border border-transparent uppercase tracking-wider text-xs",
                  active
                    ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan"
                    : "text-fg-dim",
                )}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
          <div className="border-t border-border/60 mt-2 pt-2 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-fg-muted"
              onClick={() => setOpen(false)}
            >
              <ExternalLink className="h-4 w-4" /> view site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-neon-magenta"
            >
              <LogOut className="h-4 w-4" /> logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
