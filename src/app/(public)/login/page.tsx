import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isLoggedInServer } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { GlitchText } from "@/components/cyber/GlitchText";

export const metadata: Metadata = { title: "Login // RC.dev" };

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  if (isLoggedInServer()) {
    redirect(searchParams?.from || "/admin");
  }

  return (
    <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(255,43,214,0.15),transparent_60%)]" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
            secure shell // 0x00FF
          </p>
          <GlitchText as="h1" className="text-3xl">
            ADMIN ACCESS
          </GlitchText>
          <p className="font-mono text-xs text-fg-muted">
            authenticate to enter the control panel
          </p>
        </div>
        <LoginForm redirectTo={searchParams?.from} />
      </div>
    </main>
  );
}
