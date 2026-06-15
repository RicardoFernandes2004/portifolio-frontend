import { cn } from "@/lib/utils";
import { levelToBars } from "@/lib/utils";

interface LevelBarsProps {
  level: number;
  max?: number;
  variant?: "cyan" | "magenta" | "yellow" | "green";
  className?: string;
}

const variants = {
  cyan: { on: "bg-neon-cyan shadow-neon-cyan", off: "bg-neon-cyan/15" },
  magenta: { on: "bg-neon-magenta shadow-neon-magenta", off: "bg-neon-magenta/15" },
  yellow: { on: "bg-neon-yellow shadow-neon-yellow", off: "bg-neon-yellow/15" },
  green: { on: "bg-neon-green", off: "bg-neon-green/15" },
};

export function LevelBars({
  level,
  max = 5,
  variant = "cyan",
  className,
}: LevelBarsProps) {
  const bars = levelToBars(level, max);
  const v = variants[variant];
  return (
    <div className={cn("flex items-center gap-1 sm:gap-1.5 shrink-0", className)}>
      {bars.map((on, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-4 sm:w-6 cyber-clip-sm transition-all",
            on ? v.on : v.off,
          )}
        />
      ))}
    </div>
  );
}
