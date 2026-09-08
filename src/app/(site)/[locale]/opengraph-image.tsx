import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { apiGetSafe } from "@/lib/api/server";
import type { ResumeHeader } from "@/lib/api/types";
import { tr } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

// PNG gerado pelo próprio Next. O og-image.svg anterior não era renderizado
// por Twitter/X nem Facebook.
export const alt = "RC.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations({ locale, namespace: "site" });
  const header = await apiGetSafe<ResumeHeader>("/resume/header");

  const name = header?.name ?? "RC.dev";
  const jobTitle = header
    ? tr(locale, header.jobTitle, header.jobTitleEn)
    : t("description");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          // ponytail: fundo chapado. O Satori do next/og não parseia rgba()
          // dentro de backgroundImage, então o grid neon fica de fora.
          background: "#07070d",
        }}
      >
        <div style={{ display: "flex", color: "#00f0ff", fontSize: 28, letterSpacing: 8 }}>
          RC.DEV
        </div>
        <div
          style={{
            display: "flex",
            color: "#f3f4f8",
            fontSize: 84,
            fontWeight: 700,
            marginTop: 24,
          }}
        >
          {name}
        </div>
        <div style={{ display: "flex", color: "#ff2bd6", fontSize: 40, marginTop: 12 }}>
          {jobTitle}
        </div>
        <div
          style={{
            display: "flex",
            width: 320,
            height: 8,
            marginTop: 40,
            background: "linear-gradient(90deg,#00f0ff,#ff2bd6)",
          }}
        />
      </div>
    ),
    size,
  );
}
