"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http, extractErrorMessage } from "@/lib/api/http";
import type { User } from "@/lib/api/types";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { FieldShell, TextInput } from "@/components/admin/Field";
import { useToast } from "@/components/admin/Toast";
import {
  AlertTriangle,
  Copy,
  KeyRound,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

interface SetupResponse {
  secret: string;
  otpauthUri: string;
}

export function SecurityPanel() {
  const qc = useQueryClient();
  const toast = useToast();

  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await http.get<User>("/auth/me")).data,
    retry: false,
  });

  const [setup, setSetup] = useState<SetupResponse | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const startMut = useMutation({
    mutationFn: async () =>
      (await http.post<SetupResponse>("/auth/2fa/setup")).data,
    onSuccess: setSetup,
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const enableMut = useMutation({
    mutationFn: async (code: string) =>
      (await http.post<{ backupCodes: string[] }>("/auth/2fa/enable", { code }))
        .data,
    onSuccess: (data) => {
      setSetup(null);
      setBackupCodes(data.backupCodes);
      toast.push("2FA ativado");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const disableMut = useMutation({
    mutationFn: async (input: { password: string; code: string }) =>
      http.post("/auth/2fa/disable", input),
    onSuccess: () => {
      setBackupCodes(null);
      toast.push("2FA desativado");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const regenMut = useMutation({
    mutationFn: async (code: string) =>
      (
        await http.post<{ backupCodes: string[] }>("/auth/2fa/backup-codes", {
          code,
        })
      ).data,
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes);
      toast.push("códigos regenerados — os antigos não valem mais");
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  if (isLoading) {
    return (
      <p className="font-mono text-sm text-neon-cyan terminal-prompt">
        loading...
      </p>
    );
  }

  const enabled = me?.twoFactorEnabled ?? false;

  return (
    <div className="space-y-6">
      {backupCodes && (
        <BackupCodesCard
          codes={backupCodes}
          onDismiss={() => setBackupCodes(null)}
        />
      )}

      <CyberCard variant={enabled ? "cyan" : "magenta"}>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            {enabled ? (
              <ShieldCheck className="h-5 w-5 text-neon-green" />
            ) : (
              <ShieldOff className="h-5 w-5 text-neon-magenta" />
            )}
            <div>
              <p className="font-display font-bold">
                {enabled ? "2FA ativo" : "2FA desligado"}
              </p>
              <p className="font-mono text-xs text-fg-muted">
                {enabled
                  ? "login e redefinição de senha exigem um código"
                  : "só a senha protege o painel"}
              </p>
            </div>
          </div>

          {!enabled && !setup && (
            <NeonButton
              variant="cyan"
              iconLeft={<KeyRound className="h-4 w-4" />}
              loading={startMut.isPending}
              onClick={() => startMut.mutate()}
            >
              ativar 2FA
            </NeonButton>
          )}

          {!enabled && setup && (
            <EnrollmentSteps
              setup={setup}
              submitting={enableMut.isPending}
              onConfirm={(code) => enableMut.mutate(code)}
              onCancel={() => setSetup(null)}
            />
          )}

          {enabled && (
            <CodeActions
              onRegenerate={(code) => regenMut.mutate(code)}
              onDisable={(password, code) =>
                disableMut.mutate({ password, code })
              }
              regenerating={regenMut.isPending}
              disabling={disableMut.isPending}
            />
          )}
        </div>
      </CyberCard>
    </div>
  );
}

function EnrollmentSteps({
  setup,
  onConfirm,
  onCancel,
  submitting,
}: {
  setup: SetupResponse;
  onConfirm: (code: string) => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const [code, setCode] = useState("");
  // ponytail: entrada manual do segredo; se incomodar, gerar QR com a lib qrcode
  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
          1. adicione no app autenticador
        </p>
        <p className="font-mono text-[11px] text-fg-muted">
          Bitwarden, 1Password, Google Authenticator — qualquer um. Cadastre
          manualmente com o segredo abaixo:
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 break-all border border-border bg-bg-deep/80 px-3 py-2 font-mono text-sm text-neon-green cyber-clip-sm">
            {setup.secret.match(/.{1,4}/g)?.join(" ")}
          </code>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(setup.secret)}
            className="p-2 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all"
            aria-label="copiar segredo"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
          2. confirme com o código gerado
        </p>
        <FieldShell label="código de 6 dígitos">
          <TextInput
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            inputMode="numeric"
          />
        </FieldShell>
      </div>

      <div className="flex gap-3">
        <NeonButton
          variant="cyan"
          loading={submitting}
          onClick={() => code.trim() && onConfirm(code.trim())}
        >
          confirmar e ativar
        </NeonButton>
        <NeonButton variant="ghost" onClick={onCancel}>
          cancelar
        </NeonButton>
      </div>
    </div>
  );
}

function CodeActions({
  onRegenerate,
  onDisable,
  regenerating,
  disabling,
}: {
  onRegenerate: (code: string) => void;
  onDisable: (password: string, code: string) => void;
  regenerating: boolean;
  disabling: boolean;
}) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4 border-t border-border/60 pt-4">
      <FieldShell
        label="código de verificação"
        hint="do app autenticador ou um código de backup"
      >
        <TextInput
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
        />
      </FieldShell>

      <NeonButton
        variant="cyan"
        loading={regenerating}
        onClick={() => code.trim() && onRegenerate(code.trim())}
      >
        gerar novos códigos de backup
      </NeonButton>

      <div className="border-t border-border/60 pt-4 space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-neon-red">
          zona de risco
        </p>
        <FieldShell label="senha atual" hint="desativar exige senha E código">
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FieldShell>
        <NeonButton
          variant="ghost"
          loading={disabling}
          iconLeft={<ShieldOff className="h-4 w-4" />}
          onClick={() =>
            password && code.trim() && onDisable(password, code.trim())
          }
        >
          desativar 2FA
        </NeonButton>
      </div>
    </div>
  );
}

function BackupCodesCard({
  codes,
  onDismiss,
}: {
  codes: string[];
  onDismiss: () => void;
}) {
  return (
    <CyberCard variant="magenta">
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-2 text-neon-yellow">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold">
              Guarde estes códigos agora
            </p>
            <p className="font-mono text-xs text-fg-muted">
              Eles não aparecem de novo — o servidor guarda só o hash. Cada um
              serve uma única vez e é o que destrava o painel se você perder o
              celular.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
          {codes.map((c) => (
            <li
              key={c}
              className="border border-border bg-bg-deep/80 px-3 py-2 text-neon-green cyber-clip-sm"
            >
              {c}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <NeonButton
            variant="cyan"
            size="sm"
            iconLeft={<Copy className="h-4 w-4" />}
            onClick={() => navigator.clipboard?.writeText(codes.join("\n"))}
          >
            copiar todos
          </NeonButton>
          <NeonButton variant="ghost" size="sm" onClick={onDismiss}>
            já guardei
          </NeonButton>
        </div>
      </div>
    </CyberCard>
  );
}
