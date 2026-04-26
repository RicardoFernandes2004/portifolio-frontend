"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  experiencesApi,
  extractErrorMessage,
  type Experience,
} from "@/lib/api";
import { FormShell } from "@/components/admin/FormShell";
import { FieldShell, TextInput, TextAreaInput } from "@/components/admin/Field";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

const schema = z.object({
  company: z.string().min(1, "obrigatório"),
  position: z.string().min(1, "obrigatório"),
  description: z.string().min(1, "obrigatório"),
  startDate: z.string().min(1, "obrigatório"),
  endDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function toDateInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function ExperienceForm({ initial }: { initial?: Experience }) {
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
      company: initial?.company ?? "",
      position: initial?.position ?? "",
      description: initial?.description ?? "",
      startDate: toDateInput(initial?.startDate),
      endDate: toDateInput(initial?.endDate),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const payload = {
        company: values.company,
        position: values.position,
        description: values.description,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate
          ? new Date(values.endDate).toISOString()
          : null,
      };
      if (initial) {
        await experiencesApi.update(initial.id, payload);
        toast.push("experiência atualizada");
      } else {
        await experiencesApi.create(payload);
        toast.push("experiência criada");
      }
      router.push("/admin/experiences");
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
          <Link href="/admin/experiences">
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
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="company" error={errors.company?.message} required>
          <TextInput {...register("company")} placeholder="Acme Corp" />
        </FieldShell>
        <FieldShell label="position" error={errors.position?.message} required>
          <TextInput
            {...register("position")}
            placeholder="Software Engineer"
          />
        </FieldShell>
      </div>

      <FieldShell
        label="description"
        error={errors.description?.message}
        required
      >
        <TextAreaInput
          {...register("description")}
          placeholder="O que você fez, com qual stack, com quais resultados..."
          rows={6}
        />
      </FieldShell>

      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="start date" error={errors.startDate?.message} required>
          <TextInput type="date" {...register("startDate")} />
        </FieldShell>
        <FieldShell
          label="end date"
          hint="vazio = ainda atual"
          error={errors.endDate?.message}
        >
          <TextInput type="date" {...register("endDate")} />
        </FieldShell>
      </div>
    </FormShell>
  );
}
