"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";
interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  push: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-xs w-full">
        {toasts.map((t) => {
          const Icon =
            t.variant === "success"
              ? CheckCircle2
              : t.variant === "error"
                ? AlertTriangle
                : Info;
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-start gap-2 px-3 py-2 cyber-clip-sm border bg-bg-panel/95 backdrop-blur font-mono text-xs animate-slide-up",
                t.variant === "success" &&
                  "border-neon-green/60 text-neon-green shadow-[0_0_16px_rgba(57,255,138,0.3)]",
                t.variant === "error" &&
                  "border-neon-red/60 text-neon-red shadow-[0_0_16px_rgba(255,60,82,0.3)]",
                t.variant === "info" &&
                  "border-neon-cyan/60 text-neon-cyan shadow-neon-cyan",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="text-fg-muted hover:text-fg"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      push: (msg: string) => {
        if (typeof window !== "undefined") console.log("[toast]", msg);
      },
    };
  }
  return ctx;
}
