import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { apiGetSafe, PUBLIC_REVALIDATE } from "@/lib/api/server";
import type { Post } from "@/lib/api/types";
import { alternates } from "@/lib/seo";
import { formatDate, tr } from "@/lib/utils";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Chip } from "@/components/cyber/Chip";
import { NeonButton } from "@/components/cyber/NeonButton";
import { MarkdownView } from "@/components/blog/MarkdownView";
import { PostJsonLd } from "@/components/seo/PostJsonLd";
import { PostInteractions } from "./PostInteractions";
import { CommentSection } from "./CommentSection";
import { ArrowLeft } from "lucide-react";

export const revalidate = PUBLIC_REVALIDATE;

interface Props {
  params: { locale: Locale; slug: string };
}

export async function generateMetadata({
  params: { locale, slug },
}: Props): Promise<Metadata> {
  const post = await apiGetSafe<Post>(`/posts/slug/${slug}`);
  if (!post) {
    const t = await getTranslations({ locale, namespace: "post" });
    return { title: t("notFound") };
  }
  return {
    title: tr(locale, post.title, post.titleEn),
    description: tr(locale, post.summary, post.summaryEn),
    alternates: alternates(`/blog/${slug}`, locale),
    openGraph: {
      type: "article",
      title: tr(locale, post.title, post.titleEn),
      description: tr(locale, post.summary, post.summaryEn),
      publishedTime: post.publishedAt ?? undefined,
      ...(post.images?.[0] && { images: [post.images[0]] }),
    },
  };
}

export default async function PostPage({ params: { locale, slug } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("post");

  const post = await apiGetSafe<Post>(`/posts/slug/${slug}`);
  if (!post || !post.isPublished) notFound();

  const title = tr(locale, post.title, post.titleEn);
  const summary = tr(locale, post.summary, post.summaryEn);
  const content = tr(locale, post.content, post.contentEn);
  const cover = post.images?.[0];

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-16 md:py-20 space-y-10">
      <PostJsonLd post={post} locale={locale} />

      <div>
        <Link href="/blog">
          <NeonButton variant="ghost" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {t("back")}
          </NeonButton>
        </Link>
      </div>

      <header className="space-y-5">
        <div className="flex items-center gap-3 flex-wrap font-mono text-xs uppercase tracking-widest text-fg-muted">
          {post.category && (
            <Chip variant="cyan">
              {tr(locale, post.category.name, post.category.nameEn)}
            </Chip>
          )}
          {post.publishedAt && (
            <span>{formatDate(post.publishedAt, locale)}</span>
          )}
        </div>
        <GlitchText className="text-3xl md:text-5xl leading-tight" as="h1">
          {title}
        </GlitchText>
        <p className="text-lg text-fg-dim">{summary}</p>
        <PostInteractions
          postId={post.id}
          initialLikeCount={post.likeCount}
          initialViewCount={post.viewCount}
          initialCommentCount={post.commentCount}
        />
        <div className="neon-divider w-32" />
      </header>

      {cover && (
        <div className="relative aspect-video overflow-hidden cyber-clip border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt={title} className="h-full w-full object-cover" />
        </div>
      )}

      <MarkdownView source={content} />

      <div className="pt-8 border-t border-border/60">
        <CommentSection postId={post.id} locale={locale} />
      </div>

      <div className="pt-8 border-t border-border/60">
        <Link href="/blog">
          <NeonButton variant="cyan" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {t("backToBlog")}
          </NeonButton>
        </Link>
      </div>
    </main>
  );
}
