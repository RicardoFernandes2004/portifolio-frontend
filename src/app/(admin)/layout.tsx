import type { Metadata } from "next";
import "../globals.css";
import { GridBg } from "@/components/cyber/GridBg";
import { Scanlines } from "@/components/cyber/Scanlines";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { fontVariables } from "@/lib/fonts";

// O painel é só para o admin: sempre em português e fora do índice.
export const metadata: Metadata = {
  title: "admin // RC.dev",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body className="min-h-screen antialiased">
        <GridBg />
        <Scanlines />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
