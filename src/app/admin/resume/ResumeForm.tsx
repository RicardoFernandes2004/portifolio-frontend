"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractErrorMessage, resumeApi, type ResumeHeader } from "@/lib/api";
import { FormShell } from "@/components/admin/FormShell";
import { FieldShell, TextInput, TextAreaInput } from "@/components/admin/Field";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useState } from "react";
import { Save } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

const schema = z.object({
  name: z.string().min(1),
  jobTitle: z.string().min(1),
  summary: z.string().min(1),
  location: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().default(""),
  website: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  github: z.string().optional().default(""),
});
type FormData = z.infer<typeof schema>;

export function ResumeForm({ initial }: { initial?: ResumeHeader }) {
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
      jobTitle: initial?.jobTitle ?? "",
      summary: initial?.summary ?? "",
      location: initial?.location ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      website: initial?.website ?? "",
      linkedin: initial?.linkedin ?? "",
      github: initial?.github ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await resumeApi.updateHeader(values);
      toast.push("header atualizado");
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
        <NeonButton
          type="submit"
          variant="cyan"
          iconLeft={<Save className="h-4 w-4" />}
          loading={isSubmitting}
        >
          salvar
        </NeonButton>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="name" error={errors.name?.message} required>
          <TextInput {...register("name")} placeholder="Ricardo" />
        </FieldShell>
        <FieldShell label="job title" error={errors.jobTitle?.message} required>
          <TextInput
            {...register("jobTitle")}
            placeholder="Software Engineer"
          />
        </FieldShell>
      </div>
      <FieldShell label="summary" error={errors.summary?.message} required>
        <TextAreaInput
          {...register("summary")}
          rows={5}
          placeholder="Breve resumo profissional (aparece na home e no /about)"
        />
      </FieldShell>
      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="location" error={errors.location?.message}>
          <TextInput {...register("location")} placeholder="Porto Alegre, BR" />
        </FieldShell>
        <FieldShell label="email" error={errors.email?.message}>
          <TextInput
            {...register("email")}
            placeholder="hello@example.com"
            type="email"
          />
        </FieldShell>
        <FieldShell label="phone" error={errors.phone?.message}>
          <TextInput {...register("phone")} placeholder="+55 51 ..." />
        </FieldShell>
        <FieldShell label="website" error={errors.website?.message}>
          <TextInput {...register("website")} placeholder="https://..." />
        </FieldShell>
        <FieldShell label="linkedin" error={errors.linkedin?.message}>
          <TextInput
            {...register("linkedin")}
            placeholder="https://linkedin.com/in/..."
          />
        </FieldShell>
        <FieldShell label="github" error={errors.github?.message}>
          <TextInput
            {...register("github")}
            placeholder="https://github.com/..."
          />
        </FieldShell>
      </div>
    </FormShell>
  );
}
