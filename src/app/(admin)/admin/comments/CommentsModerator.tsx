"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi, extractErrorMessage, type Comment } from "@/lib/api";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useToast } from "@/components/admin/Toast";
import { Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function CommentsModerator() {
  const qc = useQueryClient();
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["comments", "pending"],
    queryFn: postsApi.pendingComments,
  });

  const approveMut = useMutation({
    mutationFn: (id: number) => postsApi.approveComment(id),
    onSuccess: () => {
      toast.push("comentário aprovado");
      qc.invalidateQueries({ queryKey: ["comments", "pending"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => postsApi.deleteComment(id),
    onSuccess: () => {
      toast.push("comentário removido");
      qc.invalidateQueries({ queryKey: ["comments", "pending"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const pending = data ?? [];

  return (
    <CyberCard variant="magenta">
      <div className="p-5">
        {isLoading ? (
          <p className="font-mono text-sm text-neon-cyan terminal-prompt">
            loading...
          </p>
        ) : pending.length === 0 ? (
          <p className="font-mono text-sm text-fg-muted terminal-prompt">
            nenhum comentário pendente.
          </p>
        ) : (
          <ul className="divide-y divide-border/50">
            {pending.map((c) => (
              <CommentRow
                key={c.id}
                comment={c}
                onApprove={() => approveMut.mutate(c.id)}
                onDelete={() => deleteMut.mutateAsync(c.id)}
                approving={approveMut.isPending}
              />
            ))}
          </ul>
        )}
      </div>
    </CyberCard>
  );
}

function CommentRow({
  comment,
  onApprove,
  onDelete,
  approving,
}: {
  comment: Comment;
  onApprove: () => void;
  onDelete: () => Promise<void>;
  approving: boolean;
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-neon-cyan">#{comment.id}</span>
          <span className="text-fg">{comment.authorName}</span>
          <span className="text-fg-muted">
            post {comment.postId}
            {comment.parentId ? ` · reply de #${comment.parentId}` : ""}
          </span>
          <span className="text-fg-muted">
            {formatDate(comment.createdAt, "pt", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="font-body text-sm text-fg-dim whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <NeonButton
          size="sm"
          variant="cyan"
          iconLeft={<Check className="h-4 w-4" />}
          loading={approving}
          onClick={onApprove}
        >
          aprovar
        </NeonButton>
        <ConfirmDelete iconOnly onConfirm={onDelete} />
      </div>
    </li>
  );
}
