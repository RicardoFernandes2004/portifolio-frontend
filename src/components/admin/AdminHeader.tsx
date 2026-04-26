import Link from "next/link";
import { GlitchText } from "@/components/cyber/GlitchText";
import { NeonButton } from "@/components/cyber/NeonButton";
import { Plus } from "lucide-react";

interface AdminHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function AdminHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: AdminHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-4 flex-wrap mb-8">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          {eyebrow}
        </p>
        <GlitchText className="text-3xl md:text-4xl">{title}</GlitchText>
        {description && (
          <p className="text-fg-dim max-w-2xl">{description}</p>
        )}
        <div className="neon-divider w-24" />
      </div>
      {actionHref && actionLabel && (
        <Link href={actionHref}>
          <NeonButton variant="cyan" iconLeft={<Plus className="h-4 w-4" />}>
            {actionLabel}
          </NeonButton>
        </Link>
      )}
    </header>
  );
}
