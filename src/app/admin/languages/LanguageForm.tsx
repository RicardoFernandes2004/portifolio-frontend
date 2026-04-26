"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractErrorMessage, languagesApi, type Language } from "@/lib/api";
import { FormShell } from "@/components/admin/FormShell";
import { FieldShell, TextInput } from "@/components/admin/Field";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

const schema = z.object({
  name: z.string().min(1, "obrigatório"),
  level: z.coerce.number().int().min(1).max(5),
});
type FormData = z.infer<typeof schema>;

export function LanguageForm({ initial }: { initial?: Language }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      level: initial?.level ?? 3,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      if (initial) {
        await languagesApi.update(initial.id, values);
        toast.push("idioma atualizado");
      } else {
        await languagesApi.create(values);
        toast.push("idioma criado");
      }
      router.push("/admin/languages");
      router.refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  });

  return (
    <FormShell
      onSubmit={onSubmit}
      error={error}
      footer={
        <>
          <NeonButton
            type="submit"
            variant="cyan"
            iconLeft={<Save className="h-4 w-4" />}
            loading={isSubmitting}
          >
            {initial ? "salvar" : "criar"}
          </NeonButton>
          <Link href="/admin/languages">
            <NeonButton
              type="button"
              variant="ghost"
              iconLeft={<ArrowLeft className="h-4 w-4" />}
            >
              cancelar
            </NeonButton>
          </Link>
        </>
      }
    >
      <FieldShell label="name" error={errors.name?.message} required>
        <TextInput {...register("name")} placeholder="Inglês" />
      </FieldShell>
      <FieldShell
        label="level (1-5)"
        error={errors.level?.message}
        required
        hint="5 = nativo/fluente"
      >
        <TextInput type="number" min={1} max={5} {...register("level")} />
      </FieldShell>
    </FormShell>
  );
}
