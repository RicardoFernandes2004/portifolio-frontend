"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  experiencesApi,
  extractErrorMessage,
  type Experience,
} from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Chip } from "@/components/cyber/Chip";
import { useToast } from "@/components/admin/Toast";
import { Edit3 } from "lucide-react";
import { formatDateRange } from "@/lib/utils";

export function ExperiencesTable() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: experiencesApi.list,
  });
  const removeMut = useMutation({
    mutationFn: (id: number) => experiencesApi.remove(id),
    onSuccess: () => {
      toast.push("experiência removida");
      qc.invalidateQueries({ queryKey: ["experiences"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const sorted = [...(data ?? [])].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const columns: Column<Experience>[] = [
    {
      key: "company",
      header: "company",
      cell: (e) => (
        <div>
          <p className="font-display font-semibold">{e.company}</p>
          <p className="font-mono text-xs text-neon-cyan">{e.position}</p>
        </div>
      ),
    },
    {
      key: "period",
      header: "period",
      cell: (e) => (
        <Chip variant={e.endDate ? "cyan" : "green"}>
          {formatDateRange(e.startDate, e.endDate)}
        </Chip>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right",
      cell: (e) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/experiences/${e.id}/edit`}
            className="p-1.5 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all"
          >
            <Edit3 className="h-4 w-4" />
          </Link>
          <ConfirmDelete iconOnly onConfirm={() => removeMut.mutateAsync(e.id)} />
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
