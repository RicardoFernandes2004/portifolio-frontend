"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { NeonButton } from "@/components/cyber/NeonButton";

interface ConfirmDeleteProps {
  onConfirm: () => Promise<void> | void;
  message?: string;
  triggerLabel?: string;
  iconOnly?: boolean;
}

export function ConfirmDelete({
  onConfirm,
  message = "Esta ação não pode ser desfeita.",
  triggerLabel = "delete",
  iconOnly,
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {iconOnly ? (
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 border border-neon-red/40 text-neon-red hover:bg-neon-red/10 cyber-clip-sm transition-all"
          aria-label="delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <NeonButton
          variant="danger"
          size="sm"
          iconLeft={<Trash2 className="h-4 w-4" />}
          onClick={() => setOpen(true)}
        >
          {triggerLabel}
        </NeonButton>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-deep/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md p-[1px] before:absolute before:inset-0 before:cyber-clip before:bg-gradient-to-br before:from-neon-red before:to-neon-magenta">
            <div className="cyber-clip bg-bg-panel p-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="p-2 border border-neon-red text-neon-red cyber-clip-sm">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-neon-red">
                    confirm deletion
                  </h3>
                  <p className="font-mono text-sm text-fg-dim mt-1">
                    {message}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-fg-muted hover:text-fg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 justify-end pt-2 border-t border-border/60">
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                >
                  cancel
                </NeonButton>
                <NeonButton
                  variant="danger"
                  size="sm"
                  loading={busy}
                  onClick={handleConfirm}
                  iconLeft={<Trash2 className="h-4 w-4" />}
                >
                  delete
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
