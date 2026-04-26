"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractErrorMessage, skillsApi, type Skill } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { LevelBars } from "@/components/cyber/LevelBars";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useToast } from "@/components/admin/Toast";
import { Edit3 } from "lucide-react";
import { truncate } from "@/lib/utils";

export function SkillsTable() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.list,
  });
  const removeMut = useMutation({
    mutationFn: (id: number) => skillsApi.remove(id),
    onSuccess: () => {
      toast.push("skill removida");
      qc.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const columns: Column<Skill>[] = [
    {
      key: "name",
      header: "name",
      cell: (s) => (
        <div className="flex items-center gap-3">
          {s.icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.icon}
              alt=""
              className="h-5 w-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="font-display font-semibold">{s.name}</span>
        </div>
      ),
    },
    {
      key: "level",
      header: "level",
      cell: (s) => <LevelBars level={s.level} variant="cyan" />,
    },
    {
      key: "description",
      header: "description",
      cell: (s) => (
        <span className="text-fg-dim">{truncate(s.description ?? "—", 80)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      cell: (s) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/skills/${s.id}/edit`}
            className="p-1.5 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all"
          >
            <Edit3 className="h-4 w-4" />
          </Link>
          <ConfirmDelete
            iconOnly
            onConfirm={() => removeMut.mutateAsync(s.id)}
          />
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
