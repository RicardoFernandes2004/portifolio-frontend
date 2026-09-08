import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GlitchText } from "@/components/cyber/GlitchText";
import { NeonButton } from "@/components/cyber/NeonButton";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-24 text-center space-y-6">
      <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-magenta terminal-prompt">
        ERR // 404
      </p>
      <GlitchText className="text-6xl md:text-8xl">404</GlitchText>
      <p className="text-fg-dim text-lg">
        {t("message")}
      </p>
      <div className="flex justify-center gap-3 pt-4">
        <Link href="/">
          <NeonButton variant="cyan">{t("returnHome")}</NeonButton>
        </Link>
        <Link href="/projects">
          <NeonButton variant="ghost">{t("browseProjects")}</NeonButton>
        </Link>
      </div>
    </main>
  );
}
