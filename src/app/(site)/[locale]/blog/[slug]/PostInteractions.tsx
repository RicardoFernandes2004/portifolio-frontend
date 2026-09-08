"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, MessageSquare } from "lucide-react";
import { postsApi, extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const LIKE_KEY = (id: number) => `pf_post_liked_${id}`;
const VIEW_KEY = (id: number) => `pf_post_viewed_${id}`;

export function PostInteractions({
  postId,
  initialLikeCount,
  initialViewCount,
  initialCommentCount,
}: {
  postId: number;
  initialLikeCount: number;
  initialViewCount: number;
  initialCommentCount: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(LIKE_KEY(postId)) === "1");
    } catch {
      /* ignore storage errors */
    }
  }, [postId]);

  useEffect(() => {
    let cancelled = false;
    try {
      if (sessionStorage.getItem(VIEW_KEY(postId)) === "1") return;
    } catch {
      /* ignore storage errors */
    }
    postsApi
      .view(postId)
      .then((res) => {
        if (cancelled) return;
        setViewCount(res.viewCount);
        try {
          sessionStorage.setItem(VIEW_KEY(postId), "1");
        } catch {
          /* ignore storage errors */
        }
      })
      .catch(() => {
        /* view tracking is best-effort */
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  async function toggleLike() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const res = liked
        ? await postsApi.unlike(postId)
        : await postsApi.like(postId);
      setLiked(res.liked);
      setLikeCount(res.likeCount);
      try {
        if (res.liked) localStorage.setItem(LIKE_KEY(postId), "1");
        else localStorage.removeItem(LIKE_KEY(postId));
      } catch {
        /* ignore storage errors */
      }
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
        <button
          type="button"
          onClick={toggleLike}
          disabled={pending}
          aria-pressed={liked}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 border cyber-clip-sm transition-all disabled:opacity-50",
            liked
              ? "border-neon-magenta text-neon-magenta bg-neon-magenta/10 shadow-neon-magenta"
              : "border-border text-fg-dim hover:border-neon-magenta hover:text-neon-magenta",
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          <span>{likeCount}</span>
        </button>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-border text-fg-dim cyber-clip-sm">
          <MessageSquare className="h-4 w-4" />
          <span>{initialCommentCount}</span>
        </span>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-border text-fg-muted cyber-clip-sm">
          <Eye className="h-4 w-4" />
          <span>{viewCount}</span>
        </span>
      </div>
      {error && <p className="font-mono text-[11px] text-neon-red">{error}</p>}
    </div>
  );
}
