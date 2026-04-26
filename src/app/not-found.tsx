import Link from "next/link";
import { GlitchText } from "@/components/cyber/GlitchText";
import { NeonButton } from "@/components/cyber/NeonButton";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-24 text-center space-y-6">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-magenta terminal-prompt">
        ERR // 404
      </p>
      <GlitchText className="text-6xl md:text-8xl">404</GlitchText>
      <p className="text-fg-dim text-lg">
        signal lost. recurso não encontrado neste setor.
      </p>
      <div className="flex justify-center gap-3 pt-4">
        <Link href="/">
          <NeonButton variant="cyan">return home</NeonButton>
        </Link>
        <Link href="/projects">
          <NeonButton variant="ghost">browse projects</NeonButton>
        </Link>
      </div>
    </main>
  );
}
