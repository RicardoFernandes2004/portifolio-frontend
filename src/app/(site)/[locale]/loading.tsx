export default function GlobalLoading() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-3 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt animate-pulse-neon">
          loading // please stand by
        </p>
        <div className="flex gap-1.5 justify-center">
          <span className="h-2 w-12 bg-neon-cyan/30 cyber-clip-sm animate-pulse-neon" />
          <span className="h-2 w-12 bg-neon-magenta/30 cyber-clip-sm animate-pulse-neon [animation-delay:200ms]" />
          <span className="h-2 w-12 bg-neon-yellow/30 cyber-clip-sm animate-pulse-neon [animation-delay:400ms]" />
        </div>
      </div>
    </main>
  );
}
