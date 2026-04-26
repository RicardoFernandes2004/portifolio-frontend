"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  educationsApi,
  extractErrorMessage,
  type Education,
} from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Chip } from "@/components/cyber/Chip";
import { useToast } from "@/components/admin/Toast";
import { Edit3 } from "lucide-react";
import { formatDateRange } from "@/lib/utils";

export function EducationsTable() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["educations"],
    queryFn: educationsApi.list,
  });
  const removeMut = useMutation({
    mutationFn: (id: number) => educationsApi.remove(id),
    onSuccess: () => {
      toast.push("formação removida");
      qc.invalidateQueries({ queryKey: ["educations"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const sorted = [...(data ?? [])].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const columns: Column<Education>[] = [
    {
      key: "school",
      header: "school",
      cell: (e) => (
        <div>
          <p className="font-display font-semibold">{e.school}</p>
          <p className="font-mono text-xs text-neon-cyan">
            {e.degree} · {e.fieldOfStudy}
          </p>
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
            href={`/admin/educations/${e.id}/edit`}
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
