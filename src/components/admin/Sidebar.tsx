"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Languages,
  Tags,
  IdCard,
  MessageSquare,
  LogOut,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { clearCachedToken } from "@/lib/api/http";

const NAV = [
  { href: "/admin", label: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "posts", icon: FileText },
  { href: "/admin/comments", label: "comments", icon: MessageSquare },
  { href: "/admin/projects", label: "projects", icon: FolderGit2 },
  { href: "/admin/experiences", label: "experiences", icon: Briefcase },
  { href: "/admin/educations", label: "educations", icon: GraduationCap },
  { href: "/admin/skills", label: "skills", icon: Sparkles },
  { href: "/admin/languages", label: "languages", icon: Languages },
  { href: "/admin/categories", label: "categories", icon: Tags },
  { href: "/admin/resume", label: "resume header", icon: IdCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearCachedToken();
      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 border-r border-border/60 bg-bg-deep/80 backdrop-blur-sm h-[calc(100vh-4rem)] sticky top-16">
      <div className="px-5 py-5 border-b border-border/60">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          control panel
        </p>
        <p className="font-display text-xl font-bold mt-1 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-neon-magenta" />
          ADMIN.<span className="text-neon-cyan">SYS</span>
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 font-mono text-sm">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cyber-clip-sm border border-transparent transition-all uppercase tracking-wider text-xs",
                active
                  ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan shadow-inner-neon"
                  : "text-fg-dim hover:bg-bg-panel/60 hover:text-neon-cyan",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-fg-muted hover:text-neon-cyan transition-colors"
        >
          <ExternalLink className="h-4 w-4" /> view site
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-fg-muted hover:text-neon-magenta border border-transparent hover:border-neon-magenta/40 cyber-clip-sm transition-all disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "logging out..." : "logout"}
        </button>
      </div>
    </aside>
  );
}
