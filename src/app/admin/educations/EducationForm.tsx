"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  educationsApi,
  extractErrorMessage,
  type Education,
} from "@/lib/api";
import { FormShell } from "@/components/admin/FormShell";
import { FieldShell, TextInput } from "@/components/admin/Field";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

const schema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  fieldOfStudy: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function toDateInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export function EducationForm({ initial }: { initial?: Education }) {
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
      school: initial?.school ?? "",
      degree: initial?.degree ?? "",
      fieldOfStudy: initial?.fieldOfStudy ?? "",
      startDate: toDateInput(initial?.startDate),
      endDate: toDateInput(initial?.endDate),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const payload = {
        school: values.school,
        degree: values.degree,
        fieldOfStudy: values.fieldOfStudy,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate
          ? new Date(values.endDate).toISOString()
          : null,
      };
      if (initial) {
        await educationsApi.update(initial.id, payload);
        toast.push("formação atualizada");
      } else {
        await educationsApi.create(payload);
        toast.push("formação criada");
      }
      router.push("/admin/educations");
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
          <Link href="/admin/educations">
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
      <FieldShell label="school" error={errors.school?.message} required>
        <TextInput {...register("school")} placeholder="UFRGS" />
      </FieldShell>
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="degree" error={errors.degree?.message} required>
          <TextInput {...register("degree")} placeholder="Bacharelado" />
        </FieldShell>
        <FieldShell
          label="field of study"
          error={errors.fieldOfStudy?.message}
          required
        >
          <TextInput
            {...register("fieldOfStudy")}
            placeholder="Ciência da Computação"
          />
        </FieldShell>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="start date" error={errors.startDate?.message} required>
          <TextInput type="date" {...register("startDate")} />
        </FieldShell>
        <FieldShell label="end date" hint="vazio = ainda atual" error={errors.endDate?.message}>
          <TextInput type="date" {...register("endDate")} />
        </FieldShell>
      </div>
    </FormShell>
  );
}
