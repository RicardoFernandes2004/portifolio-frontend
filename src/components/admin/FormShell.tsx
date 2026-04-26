"use client";

import { CyberCard } from "@/components/cyber/CyberCard";
import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface FormShellProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string | null;
  children: ReactNode;
  footer: ReactNode;
}

export function FormShell({
  onSubmit,
  error,
  children,
  footer,
}: FormShellProps) {
  return (
    <CyberCard variant="cyan">
      <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-6">
        {children}
        {error && (
          <div className="flex items-start gap-2 border border-neon-red/40 bg-neon-red/10 px-3 py-2 text-xs font-mono text-neon-red cyber-clip-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex items-center gap-3 pt-2 border-t border-border/60">
          {footer}
        </div>
      </form>
    </CyberCard>
  );
}
