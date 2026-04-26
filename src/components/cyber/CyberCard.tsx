import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CyberCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "cyan" | "magenta" | "yellow" | "purple";
  children: ReactNode;
  hoverable?: boolean;
}

const variantBorder = {
  cyan: "before:bg-gradient-to-br before:from-neon-cyan before:to-neon-purple",
  magenta: "before:bg-gradient-to-br before:from-neon-magenta before:to-neon-purple",
  yellow: "before:bg-gradient-to-br before:from-neon-yellow before:to-neon-magenta",
  purple: "before:bg-gradient-to-br before:from-neon-purple before:to-neon-cyan",
};

const variantHover = {
  cyan: "hover:shadow-neon-cyan",
  magenta: "hover:shadow-neon-magenta",
  yellow: "hover:shadow-neon-yellow",
  purple: "hover:shadow-neon-purple",
};

export function CyberCard({
  className,
  variant = "cyan",
  hoverable = false,
  children,
  ...rest
}: CyberCardProps) {
  return (
    <div
      className={cn(
        "relative isolate p-[1px]",
        "before:absolute before:inset-0 before:-z-10 before:cyber-clip before:opacity-60",
        variantBorder[variant],
        hoverable && "transition-all duration-300 hover:before:opacity-100",
        hoverable && variantHover[variant],
        className,
      )}
      {...rest}
    >
      <div className="cyber-clip bg-bg-panel/80 backdrop-blur-sm h-full w-full">
        {children}
      </div>
    </div>
  );
}
