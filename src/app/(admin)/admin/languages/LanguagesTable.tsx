"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { extractErrorMessage, languagesApi, type Language } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { LevelBars } from "@/components/cyber/LevelBars";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useToast } from "@/components/admin/Toast";
import { Edit3 } from "lucide-react";

export function LanguagesTable() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: languagesApi.list,
  });
  const removeMut = useMutation({
    mutationFn: (id: number) => languagesApi.remove(id),
    onSuccess: () => {
      toast.push("idioma removido");
      qc.invalidateQueries({ queryKey: ["languages"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const columns: Column<Language>[] = [
    {
      key: "name",
      header: "name",
      cell: (l) => <span className="font-display font-semibold">{l.name}</span>,
    },
    {
      key: "level",
      header: "level",
      cell: (l) => <LevelBars level={l.level} variant="magenta" />,
    },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      cell: (l) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/languages/${l.id}/edit`}
            className="p-1.5 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all"
          >
            <Edit3 className="h-4 w-4" />
          </Link>
          <ConfirmDelete iconOnly onConfirm={() => removeMut.mutateAsync(l.id)} />
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
