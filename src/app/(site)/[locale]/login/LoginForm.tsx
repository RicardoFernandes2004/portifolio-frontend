"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NeonButton } from "@/components/cyber/NeonButton";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Lock, Mail, AlertTriangle } from "lucide-react";
import { setCachedToken } from "@/lib/api/http";

const schema = z.object({
  identifier: z.string().min(1, "obrigatório"),
  password: z.string().min(1, "obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const t = useTranslations("login");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? t("invalidCredentials"));
        return;
      }
      setCachedToken(null);
      router.replace(redirectTo || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("networkError"));
    }
  });

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
              className="w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all"
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
              className="w-full bg-bg-deep/80 border border-border focus:border-neon-cyan focus:shadow-neon-cyan outline-none pl-10 pr-3 py-2.5 font-mono text-sm cyber-clip-sm transition-all"
            />
          </div>
          {errors.password && (
            <p className="font-mono text-xs text-neon-red">
              {errors.password.message}
            </p>
          )}
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
          loading={isSubmitting}
        >
          authenticate &rarr;
        </NeonButton>

        <p className="font-mono text-[11px] uppercase tracking-widest text-fg-muted text-center pt-2">
          // unauthorized access will be logged
        </p>
      </form>
    </CyberCard>
  );
}
