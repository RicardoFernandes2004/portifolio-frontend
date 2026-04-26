"use client";

import { Plus, X } from "lucide-react";
import { TextInput } from "./Field";
import { useState } from "react";

interface StringListFieldProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function StringListField({
  value,
  onChange,
  placeholder,
}: StringListFieldProps) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 cyber-clip-sm transition-all"
          aria-label="adicionar"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((v, i) => (
            <li
              key={`${v}-${i}`}
              className="flex items-center gap-1.5 border border-neon-magenta/40 bg-neon-magenta/5 px-2 py-1 cyber-clip-sm font-mono text-xs text-neon-magenta"
            >
              <span className="break-all">{v}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="hover:text-neon-red"
                aria-label="remover"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
