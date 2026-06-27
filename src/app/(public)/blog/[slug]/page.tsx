import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { apiGetSafe } from "@/lib/api/server";
import type { Post } from "@/lib/api/types";
import { GlitchText } from "@/components/cyber/GlitchText";
import { Chip } from "@/components/cyber/Chip";
import { NeonButton } from "@/components/cyber/NeonButton";
import { MarkdownView } from "@/components/blog/MarkdownView";
import { PostInteractions } from "./PostInteractions";
import { CommentSection } from "./CommentSection";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await apiGetSafe<Post>(`/posts/slug/${params.slug}`);
  if (!post) return { title: "Post não encontrado" };
  return {
    title: `${post.title} // RC.dev`,
    description: post.summary,
  };
}

export default async function PostPage({ params }: Params) {
  const post = await apiGetSafe<Post>(`/posts/slug/${params.slug}`);
  if (!post) notFound();
  if (!post.isPublished) {
    notFound();
  }

  const cover = post.images?.[0];

  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-16 md:py-20 space-y-10">
      <div>
        <Link href="/blog">
          <NeonButton variant="ghost" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            voltar
          </NeonButton>
        </Link>
      </div>

      <header className="space-y-5">
        <div className="flex items-center gap-3 flex-wrap font-mono text-xs uppercase tracking-widest text-fg-muted">
          {post.category && <Chip variant="cyan">{post.category.name}</Chip>}
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
        <GlitchText className="text-3xl md:text-5xl leading-tight" as="h1">
          {post.title}
        </GlitchText>
        <p className="text-lg text-fg-dim">{post.summary}</p>
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
          <img src={cover} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <MarkdownView source={post.content} />

      <div className="pt-8 border-t border-border/60">
        <CommentSection postId={post.id} />
      </div>

      <div className="pt-8 border-t border-border/60">
        <Link href="/blog">
          <NeonButton variant="cyan" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            voltar para o blog
          </NeonButton>
        </Link>
      </div>
    </main>
  );
}
