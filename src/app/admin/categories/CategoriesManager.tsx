"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, extractErrorMessage, type Category } from "@/lib/api";
import { CyberCard } from "@/components/cyber/CyberCard";
import { NeonButton } from "@/components/cyber/NeonButton";
import { TextInput } from "@/components/admin/Field";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useToast } from "@/components/admin/Toast";
import { Edit3, Plus, Save, X } from "lucide-react";
import { useState } from "react";

export function CategoriesManager() {
  const qc = useQueryClient();
  const toast = useToast();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(
    null,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const createMut = useMutation({
    mutationFn: (n: string) => categoriesApi.create({ name: n }),
    onSuccess: () => {
      toast.push("categoria criada");
      setName("");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      categoriesApi.update(id, { name }),
    onSuccess: () => {
      toast.push("categoria atualizada");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => categoriesApi.remove(id),
    onSuccess: () => {
      toast.push("categoria removida");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  return (
    <div className="space-y-6">
      <CyberCard variant="cyan">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = name.trim();
            if (trimmed) createMut.mutate(trimmed);
          }}
          className="p-5 flex gap-3 items-end"
        >
          <div className="flex-1 space-y-1.5">
            <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
              nova categoria
            </label>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: backend"
            />
          </div>
          <NeonButton
            type="submit"
            variant="cyan"
            iconLeft={<Plus className="h-4 w-4" />}
            loading={createMut.isPending}
          >
            criar
          </NeonButton>
        </form>
      </CyberCard>

      <CyberCard variant="magenta">
        <div className="p-5">
          {isLoading ? (
            <p className="font-mono text-sm text-neon-cyan terminal-prompt">
              loading...
            </p>
          ) : (data ?? []).length === 0 ? (
            <p className="font-mono text-sm text-fg-muted terminal-prompt">
              nenhuma categoria.
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {(data ?? []).map((c) => (
                <CategoryRow
                  key={c.id}
                  category={c}
                  editing={editing?.id === c.id ? editing : null}
                  onEdit={() => setEditing({ id: c.id, name: c.name })}
                  onCancel={() => setEditing(null)}
                  onSave={(newName) =>
                    updateMut.mutate({ id: c.id, name: newName })
                  }
                  onDelete={() => deleteMut.mutateAsync(c.id)}
                  saving={updateMut.isPending}
                  setEditingName={(n) =>
                    setEditing((prev) => (prev ? { ...prev, name: n } : prev))
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </CyberCard>
    </div>
  );
}

function CategoryRow({
  category,
  editing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  saving,
  setEditingName,
}: {
  category: Category;
  editing: { id: number; name: string } | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (n: string) => void;
  onDelete: () => Promise<void>;
  saving: boolean;
  setEditingName: (n: string) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      {editing ? (
        <div className="flex flex-1 gap-2">
          <TextInput
            value={editing.name}
            onChange={(e) => setEditingName(e.target.value)}
            autoFocus
          />
          <NeonButton
            size="sm"
            variant="cyan"
            iconLeft={<Save className="h-4 w-4" />}
            loading={saving}
            onClick={() => {
              const v = editing.name.trim();
              if (v) onSave(v);
            }}
          >
            salvar
          </NeonButton>
          <NeonButton
            size="sm"
            variant="ghost"
            iconLeft={<X className="h-4 w-4" />}
            onClick={onCancel}
          >
            cancel
          </NeonButton>
        </div>
      ) : (
        <>
          <div className="flex-1 font-mono text-sm">
            <span className="text-neon-cyan">#{category.id}</span>{" "}
            <span className="text-fg">{category.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-1.5 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all"
              aria-label="editar"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <ConfirmDelete iconOnly onConfirm={onDelete} />
          </div>
        </>
      )}
    </li>
  );
}
