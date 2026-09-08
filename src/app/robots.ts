import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Painel e porta de entrada dele não são conteúdo público.
      disallow: [
        "/admin",
        "/login",
        "/en/login",
        "/forgot-password",
        "/en/forgot-password",
        "/reset-password",
        "/en/reset-password",
        "/api",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
