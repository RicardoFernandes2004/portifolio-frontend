"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@/i18n/routing";
import { NeonButton } from "@/components/cyber/NeonButton";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Lock, Mail, AlertTriangle, ShieldCheck, ArrowLeft } from "lucide-react";
import { setCachedToken } from "@/lib/api/http";

const credentialsSchema = z.object({
  identifier: z.string().min(1, "obrigatório"),
  password: z.string().min(1, "obrigatório"),
});
type CredentialsData = z.infer<typeof credentialsSchema>;

const inputClass =
  "w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const t = useTranslations("login");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  // Presença do challenge é o que separa os dois passos.
  const [challengeToken, setChallengeToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsData>({ resolver: zodResolver(credentialsSchema) });

  function enterAdmin() {
    setCachedToken(null);
    router.replace(redirectTo || "/admin");
    router.refresh();
  }

  const onSubmit = handleSubmit(async ({ identifier, password }) => {
    setError(null);
    const isEmail = identifier.includes("@");
    const body = isEmail
      ? { email: identifier, password }
      : { username: identifier, password };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message ?? t("invalidCredentials"));
        return;
      }
      if (data?.twoFactorRequired) {
        setChallengeToken(data.challengeToken);
        return;
      }
      enterAdmin();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("networkError"));
    }
  });

  if (challengeToken) {
    return (
      <TwoFactorStep
        challengeToken={challengeToken}
        onDone={enterAdmin}
        onBack={() => {
          setChallengeToken(null);
          setError(null);
        }}
      />
    );
  }

  return (
    <CyberCard variant="magenta" className="p-[2px]">
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
            email or username
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none" />
            <input
              type="text"
              autoComplete="username"
              autoFocus
              placeholder="admin@portifolio.dev"
              {...register("identifier")}
              className={inputClass}
            />
          </div>
          {errors.identifier && (
            <p className="font-mono text-xs text-neon-red">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
            password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none" />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className={inputClass}
            />
          </div>
          {errors.password && (
            <p className="font-mono text-xs text-neon-red">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <ErrorBox message={error} />}

        <NeonButton
          type="submit"
          variant="magenta"
          size="lg"
          className="w-full"
          loading={isSubmitting}
        >
          authenticate &rarr;
        </NeonButton>

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="font-mono text-[11px] uppercase tracking-widest text-fg-muted hover:text-neon-cyan transition-colors"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted text-center">
          // unauthorized access will be logged
        </p>
      </form>
    </CyberCard>
  );
}

function TwoFactorStep({
  challengeToken,
  onDone,
  onBack,
}: {
  challengeToken: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("login");
  const [code, setCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login/2fa", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeToken, code: code.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? t("invalidCode"));
        return;
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CyberCard variant="cyan" className="p-[2px]">
      <form onSubmit={submit} className="p-6 space-y-5">
        <div className="space-y-1 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-neon-cyan" />
          <h2 className="font-display text-lg font-bold">{t("twoFactorTitle")}</h2>
          <p className="font-mono text-[11px] text-fg-muted">
            {t("twoFactorSubtitle")}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
            {t("codeLabel")}
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
            autoComplete="one-time-code"
            inputMode={useBackup ? "text" : "numeric"}
            placeholder={
              useBackup ? t("backupCodePlaceholder") : t("codePlaceholder")
            }
            className="w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none px-3 py-2.5 font-mono text-center text-lg tracking-[0.3em] cyber-clip-sm transition-all"
          />
        </div>

        {error && <ErrorBox message={error} />}

        <NeonButton
          type="submit"
          variant="cyan"
          size="lg"
          className="w-full"
          loading={submitting}
        >
          {t("verify")}
        </NeonButton>

        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-fg-muted hover:text-neon-magenta transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {t("backToPassword")}
          </button>
          <button
            type="button"
            onClick={() => {
              setUseBackup((v) => !v);
              setCode("");
            }}
            className="text-fg-muted hover:text-neon-cyan transition-colors"
          >
            {useBackup ? t("useAuthenticator") : t("useBackupCode")}
          </button>
        </div>
      </form>
    </CyberCard>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 border border-neon-red/40 bg-neon-red/10 px-3 py-2 text-xs font-mono text-neon-red cyber-clip-sm">
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
