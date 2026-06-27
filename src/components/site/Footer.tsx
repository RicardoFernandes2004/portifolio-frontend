import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { apiGetSafe } from "@/lib/api/server";
import type { ResumeHeader } from "@/lib/api/types";

export async function Footer() {
  const header = await apiGetSafe<ResumeHeader>("/resume/header");
  const github = header?.github?.trim() || null;
  const linkedin = header?.linkedin?.trim() || null;
  const email = header?.email?.trim() || null;

  return (
    <footer className="mt-24 border-t border-border/60 bg-bg-deep/60">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-1">
          <p className="font-display text-lg text-neon-cyan">RC.dev</p>
          <p className="font-mono text-xs text-fg-muted">
            <span className="terminal-prompt">conn:</span> 0x00FF — secure ::
            jwt-auth :: encrypted
          </p>
        </div>
        <div className="flex items-center gap-4 text-fg-dim">
          <Link href="/blog" className="font-mono text-xs uppercase hover:text-neon-cyan">
            blog
          </Link>
          <Link
            href="/download"
            className="font-mono text-xs uppercase hover:text-neon-cyan"
          >
            resume
          </Link>
          <Link
            href="/login"
            className="font-mono text-xs uppercase hover:text-neon-magenta"
          >
            admin
          </Link>
          {(github || linkedin || email) && (
            <span className="h-4 w-px bg-border" />
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              aria-label="github"
              className="hover:text-neon-cyan"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="linkedin"
              className="hover:text-neon-cyan"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="email"
              className="hover:text-neon-cyan"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-4 md:px-8">
        <p className="mx-auto max-w-7xl font-mono text-[10px] uppercase tracking-widest text-fg-muted">
          © {new Date().getFullYear()} — built with next.js · powered by neon
        </p>
      </div>
    </footer>
  );
}
