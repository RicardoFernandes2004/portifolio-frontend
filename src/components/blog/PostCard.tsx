import Link from "next/link";
import type { Post } from "@/lib/api/types";
import { CyberCard } from "@/components/cyber/CyberCard";
import { Chip } from "@/components/cyber/Chip";
import { formatDate, truncate } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function PostCard({ post }: { post: Post }) {
  const cover = post.images?.[0];
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <CyberCard variant="magenta" hoverable className="h-full">
        <div className="flex h-full flex-col">
          {cover && (
            <div className="relative aspect-[16/9] overflow-hidden border-b border-border/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={post.title}
                className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
            </div>
          )}
          <div className="flex-1 p-5 space-y-3">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-fg-muted">
              <span>
                {post.publishedAt ? formatDate(post.publishedAt) : "draft"}
              </span>
              {post.category && (
                <Chip variant="cyan">{post.category.name}</Chip>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-fg group-hover:text-neon-magenta transition-colors">
              {post.title}
            </h3>
            <p className="font-body text-sm text-fg-dim">
              {truncate(post.summary, 160)}
            </p>
            <div className="flex items-center gap-1 font-mono text-xs text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity pt-1">
              read more <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </CyberCard>
    </Link>
  );
}
