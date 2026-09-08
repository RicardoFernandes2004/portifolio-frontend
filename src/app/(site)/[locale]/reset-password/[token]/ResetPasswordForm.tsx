"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { API_URL } from "@/lib/api/config";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const MIN_LENGTH = 12;

const inputClass =
  "w-full bg-bg-deep/80 border border-border focus:border-neon-magenta focus:shadow-neon-magenta outline-none px-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all";

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("resetPassword");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Validação local só evita ida ao servidor; quem manda é o backend.
    if (password.length < MIN_LENGTH) {
      setError(t("tooShort"));
      return;
    }
    if (password !== confirm) {
      setError(t("mismatch"));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/password/reset`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
          ...(code.trim() && { code: code.trim() }),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? "Não foi possível redefinir a senha");
        return;
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de rede");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <CyberCard variant="cyan" className="p-[2px]">
        <div className="p-6 space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-neon-green" />
          <p className="font-body text-sm text-fg-dim">{t("success")}</p>
          <Link href="/login">
            <NeonButton variant="cyan" size="sm">
              {t("goToLogin")}
            </NeonButton>
          </Link>
        </div>
      </CyberCard>
    );
  }

  return (
    <CyberCard variant="magenta" className="p-[2px]">
      <form onSubmit={submit} className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-widest text-neon-magenta">
            {t("newPasswordLabel")}
          </label>
          <input
            type="password"
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-widest text-neon-magenta">
            {t("confirmLabel")}
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••••••"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
            {t("codeLabel")}
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="one-time-code"
            placeholder="000000"
            className={inputClass}
          />
          <p className="font-mono text-[11px] text-fg-muted">{t("codeHint")}</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 border border-neon-red/40 bg-neon-red/10 px-3 py-2 text-xs font-mono text-neon-red cyber-clip-sm">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <NeonButton
          type="submit"
          variant="magenta"
          size="lg"
          className="w-full"
          loading={submitting}
        >
          {t("submit")}
        </NeonButton>
      </form>
    </CyberCard>
  );
}
