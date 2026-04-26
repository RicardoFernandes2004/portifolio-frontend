"use client";

import { CyberCard } from "@/components/cyber/CyberCard";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  empty?: ReactNode;
  loading?: boolean;
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  empty,
  loading,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <CyberCard variant="purple">
        <div className="p-10 text-center">
          <p className="font-mono text-sm text-neon-cyan terminal-prompt">
            loading...
          </p>
        </div>
      </CyberCard>
    );
  }
  if (rows.length === 0) {
    return (
      <CyberCard variant="purple">
        <div className="p-10 text-center">
          <p className="font-mono text-sm text-fg-muted terminal-prompt">
            {empty ?? "nenhum registro encontrado."}
          </p>
        </div>
      </CyberCard>
    );
  }

  return (
    <CyberCard variant="cyan">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60 bg-bg-deep/40">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest text-neon-cyan whitespace-nowrap",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border/30 last:border-b-0 hover:bg-neon-cyan/5 transition-colors"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn("px-4 py-3 align-middle", c.className)}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CyberCard>
  );
}
