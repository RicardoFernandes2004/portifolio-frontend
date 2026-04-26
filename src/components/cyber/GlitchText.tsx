import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function GlitchText({ children, as: Tag = "h1", className }: GlitchTextProps) {
  return (
    <Tag
      data-text={children}
      className={cn(
        "relative inline-block font-display font-bold tracking-tight",
        "text-fg",
        "[text-shadow:_0_0_2px_rgb(var(--neon-cyan)/0.6)]",
        "before:absolute before:inset-0 before:content-[attr(data-text)] before:text-neon-cyan before:opacity-70 before:translate-x-[2px] before:translate-y-[1px] before:[clip-path:polygon(0_0,100%_0,100%_45%,0_45%)] before:animate-glitch before:pointer-events-none",
        "after:absolute after:inset-0 after:content-[attr(data-text)] after:text-neon-magenta after:opacity-70 after:-translate-x-[2px] after:-translate-y-[1px] after:[clip-path:polygon(0_55%,100%_55%,100%_100%,0_100%)] after:animate-glitch after:pointer-events-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
