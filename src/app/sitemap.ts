import type { MetadataRoute } from "next";
import { apiGetSafe } from "@/lib/api/server";
import type { Post, Project } from "@/lib/api/types";
import { routing, HREFLANG, type Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

// O sitemap é regerado junto com as páginas, não a cada request.
export const revalidate = 3600;

/** Uma entrada por rota, com os alternates de idioma dentro dela. */
function entry(
  pathname: string,
  opts: { lastModified?: string | Date; priority?: number } = {},
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(pathname, routing.defaultLocale),
    lastModified: opts.lastModified,
    priority: opts.priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l: Locale) => [HREFLANG[l], absoluteUrl(pathname, l)]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    apiGetSafe<Post[]>("/posts"),
    apiGetSafe<Project[]>("/projects"),
  ]);

  return [
    entry("/", { priority: 1 }),
    entry("/projects", { priority: 0.8 }),
    entry("/experiences", { priority: 0.6 }),
    entry("/about", { priority: 0.8 }),
    entry("/blog", { priority: 0.8 }),
    entry("/download", { priority: 0.5 }),
    ...(posts ?? [])
      .filter((p) => p.isPublished)
      .map((p) =>
        entry(`/blog/${p.slug}`, { lastModified: p.updatedAt, priority: 0.7 }),
      ),
    ...(projects ?? []).map((p) =>
      entry(`/projects/${p.id}`, { lastModified: p.updatedAt, priority: 0.7 }),
    ),
  ];
}
