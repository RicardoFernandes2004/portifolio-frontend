import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { apiGetSafe } from "@/lib/api/server";
import type { Category, Post } from "@/lib/api/types";
import { alternates } from "@/lib/seo";
import { cn, tr } from "@/lib/utils";
import { GlitchText } from "@/components/cyber/GlitchText";
import { PostCard } from "@/components/blog/PostCard";
import { CyberCard } from "@/components/cyber/CyberCard";

interface Props {
  params: { locale: Locale };
  searchParams?: { category?: string };
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternates("/blog", locale),
  };
}

export default async function BlogPage({
  params: { locale },
  searchParams,
}: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const categoryId = searchParams?.category
    ? Number(searchParams.category)
    : undefined;
  const path =
    categoryId && Number.isFinite(categoryId)
      ? `/posts?categoryId=${categoryId}`
      : "/posts";

  const [posts, categories] = await Promise.all([
    apiGetSafe<Post[]>(path),
    apiGetSafe<Category[]>("/categories"),
  ]);

  const sortedPosts = [...(posts ?? [])].sort((a, b) => {
    const aT = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bT = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bT - aT;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20 space-y-10">
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-neon-cyan terminal-prompt">
          ls /blog
        </p>
        <GlitchText className="text-4xl md:text-5xl">BLOG</GlitchText>
        <p className="text-fg-dim max-w-2xl">{t("description")}</p>
        <div className="neon-divider w-32" />
      </div>

      {(categories?.length ?? 0) > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
            {t("filter")}
          </span>
          <FilterChip href="/blog" active={!categoryId}>
            {t("all")}
          </FilterChip>
          {categories!.map((c) => (
            <FilterChip
              key={c.id}
              href={`/blog?category=${c.id}`}
              active={categoryId === c.id}
            >
              {tr(locale, c.name, c.nameEn)}
            </FilterChip>
          ))}
        </div>
      )}

      {sortedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((p) => (
            <PostCard key={p.id} post={p} locale={locale} />
          ))}
        </div>
      ) : (
        <CyberCard variant="purple">
          <div className="p-12 text-center">
            <p className="font-mono text-sm text-fg-muted terminal-prompt">
              {t("empty")}
            </p>
          </div>
        </CyberCard>
      )}
    </main>
  );
}

function FilterChip({
  children,
  href,
  active,
}: {
  children: React.ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 text-xs font-mono uppercase tracking-widest border cyber-clip-sm transition-all",
        active
          ? "border-neon-cyan text-neon-cyan shadow-neon-cyan bg-neon-cyan/10"
          : "border-border text-fg-dim hover:border-neon-magenta hover:text-neon-magenta",
      )}
    >
      {children}
    </Link>
  );
}
