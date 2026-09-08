"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractErrorMessage, projectsApi, type Project } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Chip } from "@/components/cyber/Chip";
import { useToast } from "@/components/admin/Toast";
import { Edit3, Eye } from "lucide-react";
import { truncate } from "@/lib/utils";

export function ProjectsTable() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.list,
  });
  const removeMut = useMutation({
    mutationFn: (id: number) => projectsApi.remove(id),
    onSuccess: () => {
      toast.push("projeto removido");
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const columns: Column<Project>[] = [
    {
      key: "title",
      header: "title",
      cell: (p) => (
        <div>
          <p className="font-display font-semibold">{p.title}</p>
          <p className="font-mono text-[11px] text-fg-muted">
            {truncate(p.description, 80)}
          </p>
        </div>
      ),
    },
    {
      key: "tech",
      header: "tech",
      cell: (p) => (
        <div className="flex flex-wrap gap-1.5 max-w-xs">
          {(p.technologies ?? []).slice(0, 4).map((t) => (
            <Chip key={t} variant="purple">
              {t}
            </Chip>
          ))}
          {(p.technologies?.length ?? 0) > 4 && (
            <Chip variant="cyan">+{p.technologies.length - 4}</Chip>
          )}
        </div>
      ),
    },
    {
      key: "media",
      header: "media",
      cell: (p) => (
        <span className="font-mono text-xs text-neon-cyan">
          {(p.images?.length ?? 0)} img
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-36 text-right",
      cell: (p) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/projects/${p.id}`}
            target="_blank"
            className="p-1.5 border border-border text-fg-muted hover:border-neon-cyan hover:text-neon-cyan cyber-clip-sm transition-all"
            aria-label="ver"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/projects/${p.id}/edit`}
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
      rows={data ?? []}
      columns={columns}
      rowKey={(r) => r.id}
      loading={isLoading}
    />
  );
}
