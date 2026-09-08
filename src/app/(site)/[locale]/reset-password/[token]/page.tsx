import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { GlitchText } from "@/components/cyber/GlitchText";
import { ResetPasswordForm } from "./ResetPasswordForm";

interface Props {
  params: { locale: Locale; token: string };
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "resetPassword" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function ResetPasswordPage({
  params: { locale, token },
}: Props) {
  const t = await getTranslations({ locale, namespace: "resetPassword" });

  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(255,43,214,0.12),transparent_60%)]" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-magenta terminal-prompt">
            recovery // 0x02
          </p>
          <GlitchText as="h1" className="text-3xl">
            {t("title")}
          </GlitchText>
          <p className="font-mono text-xs text-fg-muted">{t("subtitle")}</p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
