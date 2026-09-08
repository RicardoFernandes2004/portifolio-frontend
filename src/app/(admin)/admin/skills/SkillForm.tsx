"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractErrorMessage, skillsApi, type Skill } from "@/lib/api";
import { FormShell } from "@/components/admin/FormShell";
import { FieldShell, TextInput, TextAreaInput } from "@/components/admin/Field";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

const schema = z.object({
  name: z.string().min(1, "obrigatório"),
  level: z.coerce.number().int().min(1).max(5),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  icon: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function SkillForm({ initial }: { initial?: Skill }) {
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
      description: initial?.description ?? "",
      descriptionEn: initial?.descriptionEn ?? "",
      icon: initial?.icon ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const payload = {
        name: values.name,
        level: values.level,
        description: values.description?.trim() ? values.description : null,
        descriptionEn: values.descriptionEn?.trim() ? values.descriptionEn : null,
        icon: values.icon?.trim() ? values.icon : null,
      };
      if (initial) {
        await skillsApi.update(initial.id, payload);
        toast.push("skill atualizada");
      } else {
        await skillsApi.create(payload);
        toast.push("skill criada");
      }
      router.push("/admin/skills");
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
          <Link href="/admin/skills">
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
        <TextInput {...register("name")} placeholder="TypeScript" />
      </FieldShell>
      <FieldShell
        label="level (1-5)"
        error={errors.level?.message}
        required
        hint="auto-avaliação: 1 = básico · 5 = expert"
      >
        <TextInput type="number" min={1} max={5} {...register("level")} />
      </FieldShell>
      <FieldShell label="description" error={errors.description?.message}>
        <TextAreaInput
          {...register("description")}
          placeholder="opcional, descrição curta"
        />
      </FieldShell>
      <FieldShell label="description (en)"
        hint="tradução EN; vazio = o site cai no português">
        <TextAreaInput
          {...register("descriptionEn")}
          placeholder="opcional, descrição curta"
        />
      </FieldShell>
      <FieldShell label="icon (URL)" error={errors.icon?.message}>
        <TextInput
          {...register("icon")}
          placeholder="https://cdn.../typescript.svg"
        />
      </FieldShell>
    </FormShell>
  );
}
