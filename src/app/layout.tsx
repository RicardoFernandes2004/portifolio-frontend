import type { Metadata } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GridBg } from "@/components/cyber/GridBg";
import { Scanlines } from "@/components/cyber/Scanlines";
import { QueryProvider } from "@/components/providers/QueryProvider";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-display",
  display: "swap",
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RC.dev — Portfolio",
    template: "%s",
  },
  description:
    "Software Engineer portfolio · projetos, experiências e blog em tema cyberpunk",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "RC.dev — Portfolio",
    description: "Cyberpunk-themed portfolio: projects, experiences, blog.",
    images: ["/og-image.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "RC.dev — Portfolio",
    description: "Cyberpunk-themed portfolio: projects, experiences, blog.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${orbitron.variable} ${rajdhani.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen antialiased">
        <GridBg />
        <Scanlines />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
