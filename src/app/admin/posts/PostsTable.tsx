"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractErrorMessage, postsApi, type Post } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useToast } from "@/components/admin/Toast";
import { Edit3, Eye, EyeOff, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PostsTable() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "admin"],
    queryFn: () => postsApi.listAdmin(),
  });

  const removeMut = useMutation({
    mutationFn: (id: number) => postsApi.remove(id),
    onSuccess: () => {
      toast.push("post removido");
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });
  const publishMut = useMutation({
    mutationFn: (id: number) => postsApi.publish(id),
    onSuccess: () => {
      toast.push("post publicado");
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });
  const unpublishMut = useMutation({
    mutationFn: (id: number) => postsApi.unpublish(id),
    onSuccess: () => {
      toast.push("post despublicado");
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const sorted = [...(data ?? [])].sort((a, b) => {
    const aT = new Date(a.updatedAt).getTime();
    const bT = new Date(b.updatedAt).getTime();
    return bT - aT;
  });

  const columns: Column<Post>[] = [
    {
      key: "title",
      header: "title",
      cell: (p) => (
        <div className="space-y-0.5">
          <p className="font-display font-semibold">{p.title}</p>
          <p className="font-mono text-[11px] text-fg-muted">/{p.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "category",
      cell: (p) => (
        <span className="font-mono text-xs text-neon-cyan">
          {p.category?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "status",
      cell: (p) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 cyber-clip-sm border font-mono text-[10px] uppercase tracking-widest",
            p.isPublished
              ? "border-neon-green/60 text-neon-green bg-neon-green/5"
              : "border-neon-yellow/60 text-neon-yellow bg-neon-yellow/5",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full animate-pulse-neon",
              p.isPublished ? "bg-neon-green" : "bg-neon-yellow",
            )}
          />
          {p.isPublished ? "published" : "draft"}
        </span>
      ),
    },
    {
      key: "date",
      header: "published",
      cell: (p) => (
        <span className="font-mono text-xs text-fg-muted">
          {p.publishedAt ? formatDate(p.publishedAt) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-44 text-right",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1.5">
          {p.isPublished ? (
            <>
              <Link
                href={`/blog/${p.slug}`}
                target="_blank"
                className="p-1.5 border border-border text-fg-muted hover:border-neon-cyan hover:text-neon-cyan cyber-clip-sm transition-all"
                aria-label="ver"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
              <button
                onClick={() => unpublishMut.mutate(p.id)}
                className="p-1.5 border border-neon-yellow/40 text-neon-yellow hover:bg-neon-yellow/10 cyber-clip-sm transition-all"
                aria-label="unpublish"
                disabled={unpublishMut.isPending}
                title="unpublish"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => publishMut.mutate(p.id)}
              className="p-1.5 border border-neon-green/40 text-neon-green hover:bg-neon-green/10 cyber-clip-sm transition-all"
              aria-label="publish"
              disabled={publishMut.isPending}
              title="publish"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          <Link
            href={`/admin/posts/${p.id}/edit`}
            className="p-1.5 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all"
          >
            <Edit3 className="h-4 w-4" />
          </Link>
          <ConfirmDelete iconOnly onConfirm={() => removeMut.mutateAsync(p.id)} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      rows={sorted}
      columns={columns}
      rowKey={(r) => r.id}
      loading={isLoading}
    />
  );
}
