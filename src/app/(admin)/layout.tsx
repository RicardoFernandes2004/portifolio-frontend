import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { GridBg } from "@/components/cyber/GridBg";
import { Scanlines } from "@/components/cyber/Scanlines";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";

// O painel é só para o admin: sempre em português e fora do índice.
export const metadata: Metadata = {
  title: "admin // RC.dev",
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O painel fica fora do segmento [locale], mas reaproveita componentes do site
  // (o Header) que leem as mensagens pelo contexto. Sem provider aqui, eles
  // quebram em runtime. Sempre pt: o admin não troca de idioma.
  const messages = await getMessages({ locale: routing.defaultLocale });

  return (
    <html lang="pt-BR" className={fontVariables}>
      <body className="min-h-screen antialiased">
        <GridBg />
        <Scanlines />
        <NextIntlClientProvider
          locale={routing.defaultLocale}
          messages={messages}
        >
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
