import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  variant?: "cyan" | "magenta" | "yellow" | "purple" | "green";
  className?: string;
}

const variants = {
  cyan: "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/5",
  magenta: "border-neon-magenta/40 text-neon-magenta bg-neon-magenta/5",
  yellow: "border-neon-yellow/40 text-neon-yellow bg-neon-yellow/5",
  purple: "border-neon-purple/40 text-neon-purple bg-neon-purple/5",
  green: "border-neon-green/40 text-neon-green bg-neon-green/5",
};

export function Chip({ children, variant = "cyan", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border cyber-clip-sm",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
