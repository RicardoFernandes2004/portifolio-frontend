"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { API_URL } from "@/lib/api/config";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      // O backend responde 204 exista ou não o email; a tela mostra a mesma
      // mensagem nos dois casos, senão o front vira o oráculo que o backend evita.
      await fetch(`${API_URL}/auth/password/forgot`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de rede");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <CyberCard variant="cyan" className="p-[2px]">
        <div className="p-6 space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-neon-green" />
          <p className="font-body text-sm text-fg-dim">{t("sent")}</p>
          <Link href="/login">
            <NeonButton variant="ghost" size="sm">
              {t("backToLogin")}
            </NeonButton>
          </Link>
        </div>
      </CyberCard>
    );
  }

  return (
    <CyberCard variant="cyan" className="p-[2px]">
      <form onSubmit={submit} className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
            {t("emailLabel")}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none" />
            <input
              type="email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portifolio.dev"
              className="w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 border border-neon-red/40 bg-neon-red/10 px-3 py-2 text-xs font-mono text-neon-red cyber-clip-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <NeonButton
          type="submit"
          variant="cyan"
          size="lg"
          className="w-full"
          loading={submitting}
        >
          {t("submit")}
        </NeonButton>

        <div className="text-center">
          <Link
            href="/login"
            className="font-mono text-[11px] uppercase tracking-widest text-fg-muted hover:text-neon-cyan transition-colors"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </form>
    </CyberCard>
  );
}
