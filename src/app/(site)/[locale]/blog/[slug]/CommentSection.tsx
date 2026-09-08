"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { CornerDownRight, MessageSquare, Send } from "lucide-react";
import {
  postsApi,
  extractErrorMessage,
  type Comment,
  type CreateCommentDto,
} from "@/lib/api";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { TextAreaInput, TextInput } from "@/components/admin/Field";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export function CommentSection({
  postId,
  locale,
}: {
  postId: number;
  locale: Locale;
}) {
  const t = useTranslations("comments");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => postsApi.listComments(postId),
  });

  const comments = data ?? [];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-5 w-5 text-neon-cyan" />
        <h2 className="font-display text-2xl font-bold">
          {t("heading")}
          <span className="ml-2 font-mono text-sm text-fg-muted">
            ({comments.length})
          </span>
        </h2>
      </div>

      <CommentForm postId={postId} />

      <div className="space-y-4">
        {isLoading ? (
          <p className="font-mono text-sm text-neon-cyan terminal-prompt">
            {t("loading")}
          </p>
        ) : isError ? (
          <p className="font-mono text-sm text-neon-red terminal-prompt">
            {t("loadError")}
          </p>
        ) : comments.length === 0 ? (
          <p className="font-mono text-sm text-fg-muted terminal-prompt">
            {t("empty")}
          </p>
        ) : (
          comments.map((c) => (
            <CommentNode
              key={c.id}
              postId={postId}
              comment={c}
              depth={0}
              locale={locale}
            />
          ))
        )}
      </div>
    </section>
  );
}

function CommentNode({
  postId,
  comment,
  depth,
  locale,
}: {
  postId: number;
  comment: Comment;
  depth: number;
  locale: Locale;
}) {
  const t = useTranslations("comments");
  const [replying, setReplying] = useState(false);

  return (
    <div className={depth > 0 ? "ml-4 md:ml-8 border-l border-border/50 pl-4" : ""}>
      <CyberCard variant={depth % 2 === 0 ? "cyan" : "magenta"}>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-3 font-mono text-xs">
            <span className="text-neon-cyan">{comment.authorName}</span>
            <span className="text-fg-muted">
              {formatDate(comment.createdAt, locale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="font-body text-sm text-fg-dim whitespace-pre-wrap">
            {comment.content}
          </p>
          <button
            type="button"
            onClick={() => setReplying((v) => !v)}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-fg-muted hover:text-neon-cyan transition-colors"
          >
            <CornerDownRight className="h-3.5 w-3.5" />
            {replying ? t("cancel") : t("reply")}
          </button>
        </div>
      </CyberCard>

      {replying && (
        <div className="mt-3">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onDone={() => setReplying(false)}
            compact
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((r) => (
            <CommentNode
              key={r.id}
              postId={postId}
              comment={r}
              depth={depth + 1}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentForm({
  postId,
  parentId,
  onDone,
  compact,
}: {
  postId: number;
  parentId?: number;
  onDone?: () => void;
  compact?: boolean;
}) {
  const t = useTranslations("comments");
  const qc = useQueryClient();
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (dto: CreateCommentDto) => postsApi.createComment(postId, dto),
    onSuccess: (created) => {
      setContent("");
      setError(null);
      if (created.status === "PENDING") {
        setNotice(
          t("pending"),
        );
      } else {
        setNotice(t("published"));
        qc.invalidateQueries({ queryKey: ["comments", postId] });
        onDone?.();
      }
    },
    onError: (e) => {
      setNotice(null);
      const status =
        typeof e === "object" && e && "response" in e
          ? (e as { response?: { status?: number } }).response?.status
          : undefined;
      setError(
        status === 429
          ? t("tooFast")
          : extractErrorMessage(e),
      );
    },
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = authorName.trim();
    const text = content.trim();
    if (!name || !text) return;
    mutation.mutate({
      authorName: name,
      content: text,
      ...(parentId ? { parentId } : {}),
    });
  }

  return (
    <CyberCard variant={compact ? "magenta" : "cyan"}>
      <form onSubmit={submit} className="p-4 space-y-3">
        <TextInput
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder={t("namePlaceholder")}
          maxLength={120}
        />
        <TextAreaInput
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            parentId ? t("replyPlaceholder") : t("commentPlaceholder")
          }
          className={compact ? "min-h-[80px]" : undefined}
          maxLength={4000}
        />
        {notice && (
          <p className="font-mono text-[11px] text-neon-green">{notice}</p>
        )}
        {error && <p className="font-mono text-[11px] text-neon-red">{error}</p>}
        <div className="flex justify-end">
          <NeonButton
            type="submit"
            variant="cyan"
            size="sm"
            iconLeft={<Send className="h-4 w-4" />}
            loading={mutation.isPending}
          >
            {parentId ? t("submitReply") : t("submit")}
          </NeonButton>
        </div>
      </form>
    </CyberCard>
  );
}
