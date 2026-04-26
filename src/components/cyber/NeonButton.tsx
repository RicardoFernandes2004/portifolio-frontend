"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "cyan" | "magenta" | "yellow" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variants: Record<Variant, string> = {
  cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-cyan",
  magenta: "border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 hover:shadow-neon-magenta",
  yellow: "border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 hover:shadow-neon-yellow",
  ghost: "border-border text-fg-dim hover:border-neon-cyan hover:text-neon-cyan",
  danger: "border-neon-red text-neon-red hover:bg-neon-red/10",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  (
    {
      className,
      variant = "cyan",
      size = "md",
      loading,
      iconLeft,
      iconRight,
      children,
      disabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2",
          "font-mono uppercase tracking-[0.2em] font-semibold",
          "border bg-transparent transition-all duration-200 cyber-clip-sm",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...rest}
      >
        <span
          className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-transparent via-current to-transparent"
          style={{ filter: "blur(8px)" }}
        />
        {loading ? (
          <span className="terminal-prompt">processing...</span>
        ) : (
          <>
            {iconLeft}
            <span>{children}</span>
            {iconRight}
          </>
        )}
      </button>
    );
  },
);
NeonButton.displayName = "NeonButton";
