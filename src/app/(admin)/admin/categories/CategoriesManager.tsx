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
  const [nameEn, setNameEn] = useState("");
  const [editing, setEditing] = useState<EditingCategory | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const createMut = useMutation({
    mutationFn: (input: { name: string; nameEn: string | null }) =>
      categoriesApi.create(input),
    onSuccess: () => {
      toast.push("categoria criada");
      setName("");
      setNameEn("");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => toast.push(extractErrorMessage(e), "error"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, name, nameEn }: EditingCategory) =>
      categoriesApi.update(id, { name, nameEn: nameEn.trim() || null }),
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
            if (trimmed)
              createMut.mutate({ name: trimmed, nameEn: nameEn.trim() || null });
          }}
          className="p-5 flex flex-wrap gap-3 items-end"
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
          <div className="flex-1 space-y-1.5">
            <label className="font-mono text-xs uppercase tracking-widest text-neon-cyan">
              nome (en)
            </label>
            <TextInput
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="vazio = cai no português"
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
                  onEdit={() =>
                    setEditing({
                      id: c.id,
                      name: c.name,
                      nameEn: c.nameEn ?? "",
                    })
                  }
                  onCancel={() => setEditing(null)}
                  onSave={(next) => updateMut.mutate(next)}
                  onDelete={() => deleteMut.mutateAsync(c.id)}
                  saving={updateMut.isPending}
                  setEditingField={(patch) =>
                    setEditing((prev) => (prev ? { ...prev, ...patch } : prev))
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

interface EditingCategory {
  id: number;
  name: string;
  nameEn: string;
}

function CategoryRow({
  category,
  editing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  saving,
  setEditingField,
}: {
  category: Category;
  editing: EditingCategory | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (next: EditingCategory) => void;
  onDelete: () => Promise<void>;
  saving: boolean;
  setEditingField: (patch: Partial<EditingCategory>) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-3">
      {editing ? (
        <div className="flex flex-1 gap-2">
          <TextInput
            value={editing.name}
            onChange={(e) => setEditingField({ name: e.target.value })}
            autoFocus
          />
          <TextInput
            value={editing.nameEn}
            onChange={(e) => setEditingField({ nameEn: e.target.value })}
            placeholder="nome (en)"
          />
          <NeonButton
            size="sm"
            variant="cyan"
            iconLeft={<Save className="h-4 w-4" />}
            loading={saving}
            onClick={() => {
              const v = editing.name.trim();
              if (v) onSave({ ...editing, name: v });
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
            {category.nameEn && (
              <span className="text-fg-muted"> / {category.nameEn}</span>
            )}
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
