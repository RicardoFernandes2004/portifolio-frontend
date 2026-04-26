import type { Metadata } from "next";
import Link from "next/link";
import { apiGetSafe } from "@/lib/api/server";
import type { Category, Post } from "@/lib/api/types";
import { GlitchText } from "@/components/cyber/GlitchText";
import { PostCard } from "@/components/blog/PostCard";
import { CyberCard } from "@/components/cyber/CyberCard";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog // RC.dev" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
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
        <p className="text-fg-dim max-w-2xl">
          Anotações técnicas, decisões de arquitetura e observações de campo.
        </p>
        <div className="neon-divider w-32" />
      </div>

      {(categories?.length ?? 0) > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
            filter:
          </span>
          <FilterChip href="/blog" active={!categoryId}>
            all
          </FilterChip>
          {categories!.map((c) => (
            <FilterChip
              key={c.id}
              href={`/blog?category=${c.id}`}
              active={categoryId === c.id}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>
      )}

      {sortedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <CyberCard variant="purple">
          <div className="p-12 text-center">
            <p className="font-mono text-sm text-fg-muted terminal-prompt">
              nenhum post encontrado.
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
