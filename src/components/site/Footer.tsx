import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
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
          <span className="h-4 w-px bg-border" />
          <Link
            href="https://github.com"
            aria-label="github"
            className="hover:text-neon-cyan"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href="https://linkedin.com"
            aria-label="linkedin"
            className="hover:text-neon-cyan"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link
            href="mailto:hello@example.com"
            aria-label="email"
            className="hover:text-neon-cyan"
          >
            <Mail className="h-4 w-4" />
          </Link>
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
