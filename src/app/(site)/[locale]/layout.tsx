import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import "../../globals.css";
import { GridBg } from "@/components/cyber/GridBg";
import { Scanlines } from "@/components/cyber/Scanlines";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { fontVariables } from "@/lib/fonts";
import { routing, HREFLANG, type Locale } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "site" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | Ricardo Fernandes` },
    description,
    alternates: alternates("/", locale),
    openGraph: {
      type: "website",
      locale: HREFLANG[locale],
      url: `${SITE_URL}${locale === routing.defaultLocale ? "" : `/${locale}`}`,
      siteName: "RC.dev",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: "/favicon.svg" },
    verification: { google: "_0-JTBSBiOg7I17xrxNuMU4aAbXpNQO0brkdcJOGNiM" },
  };
}

export default async function SiteLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={HREFLANG[locale]} className={fontVariables}>
      <body className="min-h-screen antialiased">
        <GridBg />
        <Scanlines />
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <PersonJsonLd locale={locale} />
            <Header />
            {children}
            <Footer />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
