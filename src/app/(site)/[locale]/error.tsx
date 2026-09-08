"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GlitchText } from "@/components/cyber/GlitchText";
import { NeonButton } from "@/components/cyber/NeonButton";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("[next-error]", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center space-y-6">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-red terminal-prompt">
        FATAL // 0x{(error.digest ?? "ffff").slice(0, 6)}
      </p>
      <GlitchText className="text-5xl">SYSTEM FAULT</GlitchText>
      <p className="text-fg-dim font-mono text-sm">{error.message}</p>
      <div className="flex justify-center gap-3 pt-4">
        <NeonButton
          variant="cyan"
          iconLeft={<RefreshCw className="h-4 w-4" />}
          onClick={reset}
        >
          {t("retry")}
        </NeonButton>
        <Link href="/">
          <NeonButton variant="ghost">{t("returnHome")}</NeonButton>
        </Link>
      </div>
    </main>
  );
}
